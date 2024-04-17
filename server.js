import { createServer } from "http";
import imageRouter from "./app/_imageRouter.js";
import tagsRouter from "./app/_tagRouter.js";
import filtersRouter from "./app/_filterRouter.js"
createServer(async (req, res) => {
  //images

  if (req.url.search("/api/photos") != -1) {
    await imageRouter(req, res);
  }

  //tags
  else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res);
  }
  //filters
  else if (req.url.search("/api/filters") != -1) {
    await filtersRouter(req, res)
  }
}).listen(3000, () => console.log("listen on 3000"));
