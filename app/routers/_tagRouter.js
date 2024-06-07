import tracer from "tracer";
const logger = tracer.colorConsole();
import path from "path";
const __dirname = path.resolve();
import getRequestData from "../utils.js";
// import tagsController from "../controllers/03TAGScontroller.js";
import tokenManager from "../auth.js";
import tagsController from "../controllers/03TAGScontroller.js";
const tagRouter = async (request, response) => {
  if (request.url.match(/\/api\/tags\/raw$/) && request.method == "GET") {
    //GET raw tags
    console.log("Pobierz wszystkie tagi");
    try {
      const allRawTags = await tagsController.getAllRaw();
      console.log(allRawTags);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, length: allRawTags.length, tags: allRawTags }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else {
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
      // czytam dane z nagłowka
      let token = request.headers.authorization.split(" ")[1];
      console.log(token);
      console.log(tokenManager.verifyToken(token));
      if (tokenManager.verifyToken(token) && !tokenManager.invalidTokens.includes(token)) {
      } else if (request.url == "/api/tags" && request.method == "GET") {
        //GET all tags
        try {
          const allConvertedTags = await tagsController.getAllCnverted();
          console.log(allConvertedTags);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({ status: 200, length: allConvertedTags.length, tags: allConvertedTags }, null, 5)
          );
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (
        request.url.match(
          /\/api\/tags\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        request.method == "GET"
      ) {
        console.log("Pobierz jeden tag");
        const id = request.url.split("/")[3];
        try {
          const oneTag = await tagsController.getOne(id);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, tag: oneTag }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: `Tag with id: ${id}, not found` }, null, 5));
        }
      } else if (request.url == "/api/tags" && request.method == "POST") {
        //POST add TAG
        // console.log(request)
        console.log("Dodawanie jednego tagu");

        let tagData = await getRequestData(request);
        tagData = JSON.parse(tagData);
        console.log(tagData);
        // console.log(tagData.name);
        // console.log(tagData.name.match(/\#(\w+)$/));
        // try {

        try {
          const createTag = await tagsController.add(tagData);
          console.log(createTag);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, tag: createTag }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (request.url.match(/api\/tags\/(\d+)$/) && request.method == "DELETE") {
        console.log("Usuwanie tagu");
      } else if (request.url == "/api/tags" && request.method == "PATCH") {
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "404", message: `Invalid root` }));
      }
    } else {
      response.writeHead(401, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "401", message: `Unauthorized` }));
    }
  }

  // pozostałe funkcje
};

export default tagRouter;
