import tracer from "tracer";
const logger = tracer.colorConsole();
import { readFile } from "fs";
import path from "path";
const __dirname = path.resolve();
import getRequestData from "../utils.js";
import fileController from "../controllers/02FILEcontroller.js";
import jsonController from "../controllers/01JSONcontroller.js";
import tokenManager from "../auth.js";
const imageRouter = async (request, response) => {
  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
    // czytam dane z nagłowka
    let token = request.headers.authorization.split(" ")[1];
    console.log(token);
    const isValid = tokenManager.verifyToken(token);
    console.log(isValid);
    if (isValid) {
      if (
        request.url.match(
          /\/api\/photos\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        request.method == "GET"
      ) {
        //GET specific one
        // console.log("jedno zdjęcie");
        const id = request.url.split("/")[3];
        try {
          const oneJson = await jsonController.getOne(id);
          // console.log(oneJson);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, file: oneJson }, null, 5));
        } catch {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id}, not found` }, null, 5));
        }
      } else if (request.url == "/api/photos" && request.method == "GET") {
        //GET all photos
        // console.log("wszystkie zdjęcia");
        try {
          const allJson = await jsonController.getAll();
          // console.log(allJson);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, length: allJson.length, files: allJson }, null, 5));
        } catch {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Array is emptey` }, null, 5));
        }
      } else if (request.url == "/api/photos" && request.method == "POST") {
        //POST add photo
        // console.log(request);
        // console.log("dodawanie zdjęcia");
        try {
          const fileData = await fileController.add(request, isValid);
          //console.log(fileData);
          try {
            const addJson = await jsonController.add(fileData);
            // console.log(addJson);
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ status: 201, file: addJson }, null, 5));
          } catch (jsonError) {
            console.error("Failed to add JSON:", jsonError);
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ status: 500, message: `Failed to add JSON` }, null, 5));
          }
        } catch (fileError) {
          console.error("Failed to add file:", fileError);
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 500, message: `Failed to add file` }, null, 5));
        }

        // console.log("Wysłano");
      } else if (
        request.url.match(
          /\/api\/photos\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        request.method == "DELETE"
      ) {
        //DELETE one photo
        // console.log("usuń jeden element");
        const id = request.url.split("/")[3];

        try {
          const delJson = await await jsonController.delete(id);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify(
              { status: 200, message: `Photo with id: ${id} successfully deleted`, file: delJson },
              null,
              5
            )
          );
        } catch {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id} not found` }, null, 5));
        }
      } else if (request.url == "/api/photos" && request.method == "PATCH") {
        //PATCH one photo
        // console.log("zaktualizuj zdjęcie");
        let data = await getRequestData(request);
        data = JSON.parse(data);
        // console.log(data);
        try {
          const patJson = await jsonController.update(data);
          // console.log(patJson);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify(
              { status: 200, message: `Photo with id: ${data.id} successfully updated`, file: patJson },
              null,
              5
            )
          );
        } catch {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Photo with id: ${data.id} not found` }, null, 5));
        }
      } else if (request.url == "/api/photos/tags" && request.method == "PATCH") {
        //PATCH dodawanie tagu do zdjęcia
        // console.log("dodawanie tagu do zdjęcia");
        let data = await getRequestData(request);
        data = JSON.parse(data);
        // console.log(data);
        try {
          const updatedPhoto = await jsonController.updateTag(data);
          // console.log(updatedPhoto);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, file: updatedPhoto }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (
        request.url.match(
          /\/api\/photos\/tags\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        request.method == "GET"
      ) {
        //GET specific ones tags
        // console.log("Tagi zdjęcia po id");
        const id = request.url.split("/")[4];
        try {
          const photoTags = await jsonController.getOnePhotoTags(id);
          // console.log(photoTags);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, id: id, tags: photoTags }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id}, not found` }, null, 5));
        }
      } else if (request.url == "/api/photos/tags" && request.method == "PATCH") {
        //PATCH dodawanie tagu do zdjęcia
        // console.log("dodawanie tagu do zdjęcia");
        let data = await getRequestData(request);
        data = JSON.parse(data);
        // console.log(data);
        try {
          const updatedPhoto = await jsonController.updateTag(data);
          // console.log(updatedPhoto);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, file: updatedPhoto }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (
        request.url.match(
          /\/api\/getimage\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        request.method == "GET"
      ) {
        //GET specific ones tags
        // console.log("Pobranie zdjęcia po id");
        const id = request.url.split("/")[3];
        try {
          const photo = await fileController.getOne(id);
          // console.log(photo);
          response.writeHead(200, { "Content-Type": `image/${photo.ext}` });
          response.end(photo.file);
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id}, not found` }, null, 5));
        }
      } else if (
        request.url.match(
          /\/api\/getimage\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/filter\/([a-zA-Z0-9_-]+)/
        ) &&
        request.method == "GET"
      ) {
        //GET specific ones tags
        // console.log("Pobranie po przefiltrowaniu zdjęcia po id");
        const id = request.url.split("/")[3];
        const filter = request.url.split("/")[5];
        // console.log(id);
        // console.log(filter);
        try {
          const photo = await fileController.getFiltredOne(id, filter);
          // console.log(photo);
          response.writeHead(200, { "Content-Type": `image/${photo.ext}` });
          response.end(photo.file);
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "404", message: `Invalid root` }));
      }
    } else {
      response.writeHead(403, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "403", message: `Unauthorized` }));
    }
  } else {
    response.writeHead(403, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "403", message: `Unauthorized` }));
  }
  // pozostałe funkcje
};

export default imageRouter;
