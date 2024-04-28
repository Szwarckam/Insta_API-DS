import { createServer } from "http";
import imageRouter from "./app/routers/_imageRouter.js";
import tagsRouter from "./app/routers/_tagRouter.js";
import filtersRouter from "./app/routers/_filterRouter.js";
createServer(async (req, res) => {
  //images

  if (req.url.search("/api/photos") != -1 || req.url.search("/api/getimage") != -1) {
    await imageRouter(req, res);
  }

  //tags
  else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res);
  }
  //filters
  else if (req.url.search("/api/filters") != -1) {
    await filtersRouter(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "404", message: `Invalid root` }));
  }
}).listen(3000, () => console.log("listen on 3000"));
