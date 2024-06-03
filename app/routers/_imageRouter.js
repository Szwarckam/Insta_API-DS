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
  if (
    request.url.match(
      /\/api\/photos\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
    ) &&
    request.method == "GET"
  ) {
    //GET specific one

    const id = request.url.split("/")[3];
    try {
      const oneJson = await jsonController.getOne(id);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, file: oneJson }, null, 5));
    } catch {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id}, not found` }, null, 5));
    }
  } else if (request.url == "/api/photos" && request.method == "GET") {
    //GET all photos
    console.log("GET ALL PHOTOS");
    try {
      const allJson = await jsonController.getAll();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, length: allJson.length, files: allJson }, null, 5));
    } catch {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: `Array is emptey` }, null, 5));
    }
  } else if (
    request.url.match(
      /\/api\/photos\/tags\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
    ) &&
    request.method == "GET"
  ) {
    //GET specific ones tags
    const id = request.url.split("/")[4];
    try {
      const photoTags = await jsonController.getOnePhotoTags(id);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, id: id, tags: photoTags }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id}, not found` }, null, 5));
    }
  } else if (
    request.url.match(
      /\/api\/getimage\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
    ) &&
    request.method == "GET"
  ) {
    //GET specific image by id
    const id = request.url.split("/")[3];
    try {
      const photo = await fileController.getOne(id);
      response.writeHead(200, { "Content-Type": `image/${photo.ext}` });
      response.end(photo.file);
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: `Photo with id: ${id}, not found` }, null, 5));
    }
  } else if (
    request.url.match(/\/api\/getimage\/profile\/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) &&
    request.method == "GET"
  ) {
    const email = request.url.split("/")[4];
    console.log(email);
    //GET specific image by id
    try {
      const profilePhoto = await fileController.getProfileIMG(email);
      response.writeHead(200, { "Content-Type": `image/png` });
      response.end(profilePhoto.file);
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (
    request.url.match(
      /\/api\/getimage\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/filter\/([a-zA-Z0-9_-]+)/
    ) &&
    request.method == "GET"
  ) {
    //GET filtered image by id
    const id = request.url.split("/")[3];
    const filter = request.url.split("/")[5];
    try {
      const photo = await fileController.getFiltredOne(id, filter);
      response.writeHead(200, { "Content-Type": `image/${photo.ext}` });
      response.end(photo.file);
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
    // Authorization section
    let token = request.headers.authorization.split(" ")[1];
    const isValid = tokenManager.verifyToken(token);
    if (isValid && !tokenManager.invalidTokens.includes(token)) {
      if (request.url == "/api/photos" && request.method == "POST") {
        //POST add photo
        try {
          const fileData = await fileController.add(request, isValid);
          try {
            const addJson = await jsonController.add(fileData);
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
      } else if (
        request.url.match(
          /\/api\/photos\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        request.method == "DELETE"
      ) {
        //DELETE one photo
        const id = request.url.split("/")[3];
        try {
          const delJson = await jsonController.delete(id);
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
        let data = await getRequestData(request);
        data = JSON.parse(data);
        try {
          const patJson = await jsonController.update(data);
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
      } else if (request.url == "/api/photos/like" && request.method == "POST") {
        //PATCH one photo
        console.log("Dodawanie like'ów");
        let data = await getRequestData(request);
        data = JSON.parse(data);
        try {
          const likeData = await jsonController.leaveLike(data, isValid);
          response.writeHead(200, { "Content-Type": "application/json" });
          console.log(likeData);
          response.end(JSON.stringify({ status: 200, message: likeData.message, files: likeData.files }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (request.url == "/api/photos/tags" && request.method == "PATCH") {
        //PATCH dodawanie tagu do zdjęcia
        let data = await getRequestData(request);
        data = JSON.parse(data);
        try {
          const updatedPhoto = await jsonController.updateTag(data);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, file: updatedPhoto }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "404", message: `Invalid route` }));
      }
    } else {
      response.writeHead(403, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "403", message: `Unauthorized` }));
    }
  } else {
    response.writeHead(403, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "403", message: `Unauthorized` }));
  }
};

export default imageRouter;
