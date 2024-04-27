import tracer from "tracer";
const logger = tracer.colorConsole();
import path from "path";
const __dirname = path.resolve();
import getRequestData from "../utils.js";
import filtersController from "../controllers/04FILTERScontroller.js";
const filtersRouter = async (request, response) => {
  if (
    request.url.match(
      /\/api\/filters\/metadata\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
    ) &&
    request.method == "GET"
  ) {
    //GET  pobranie danych meta wybranego zdjęcia
    console.log("Pobierz wszystkie dane zdjęcia po Id");
    const id = request.url.split("/")[4];
    console.log(id);
    try {
      const photoMetaData = await filtersController.getMetaData(id);
      console.log(photoMetaData);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, metaData: photoMetaData }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.url == "/api/filters" && request.method == "GET") {
    //GET all filters
  } else if (
    request.url.match(
      /\/api\/filters\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)/
    ) &&
    request.method == "GET"
  ) {
  } else if (request.url.match(/api\/filters\/(\d+)$/) && request.method == "DELETE") {
    console.log("Usuwanie tagu");
  } else if (request.url == "/api/filters" && request.method == "PATCH") {
    console.log("Dodawanie filtrów do zdjęcia");
    let filterData = await getRequestData(request);
    filterData = JSON.parse(filterData);
    try {
      const filtredPhoto = await filtersController.setFilter(filterData);
      console.log(filtredPhoto);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, file: filtredPhoto }, null, 5));
    } catch (err) {}
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "404", message: `Invalid root` }));
  }
  // pozostałe funkcje
};

export default filtersRouter;
