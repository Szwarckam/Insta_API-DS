import tracer from "tracer";
const logger = tracer.colorConsole();
import path from "path";
const __dirname = path.resolve();
import getRequestData from "../utils.js";
import filtersController from "../controllers/04FILTERScontroller.js";
import tokenManager from "../auth.js";
const filtersRouter = async (req, response) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // czytam dane z nagłowka
    let token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (tokenManager.verifyToken(token) && !tokenManager.invalidTokens.includes(token)) {
      if (
        req.url.match(
          /\/api\/filters\/metadata\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        req.method == "GET"
      ) {
        //GET  pobranie danych meta wybranego zdjęcia
        console.log("Pobierz wszystkie dane zdjęcia po Id");
        const id = req.url.split("/")[4];
        // console.log(id);
        try {
          const photoMetaData = await filtersController.getMetaData(id);
          // console.log(photoMetaData);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, metaData: photoMetaData }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (req.url == "/api/filters" && req.method == "GET") {
        //GET all filters
      } else if (
        req.url.match(
          /\/api\/filters\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
        ) &&
        req.method == "GET"
      ) {
      } else if (req.url.match(/api\/filters\/(\d+)$/) && req.method == "DELETE") {
        // console.log("Usuwanie tagu");
      } else if (req.url == "/api/filters" && req.method == "PATCH") {
        // console.log("Dodawanie filtrów do zdjęcia");
        let filterData = await getRequestData(req);
        filterData = JSON.parse(filterData);
        try {
          const filtredPhoto = await filtersController.setFilter(filterData);
          // console.log(filtredPhoto);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, file: filtredPhoto }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: "404", message: err }));
        }
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "404", message: `Invalid root` }));
      }
    } else {
      response.writeHead(401, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "401", message: `Unauthorized` }));
    }
  } else {
    response.writeHead(401, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "401", message: `Unauthorized` }));
  }

  // pozostałe funkcje
};

export default filtersRouter;
