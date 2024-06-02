import { createServer } from "http";
import imageRouter from "./app/routers/_imageRouter.js";
import tagsRouter from "./app/routers/_tagRouter.js";
import filtersRouter from "./app/routers/_filterRouter.js";
import userRouter from "./app/routers/_userRouter.js";
import profileRouter from "./app/routers/_profileRouter.js";
import tokenManager from "./app/auth.js";

import "dotenv/config";

createServer(async (req, res) => {
  //images

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  console.log("test");
  if (req.url.search("/api/photos") != -1 || req.url.search("/api/getimage") != -1) {
    console.log("Zdjęcia");
    await imageRouter(req, res);
  }
  //tags
  else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res);
  }
  //filters
  else if (req.url.search("/api/filters") != -1) {
    await filtersRouter(req, res);
  } else if (req.url.search("/api/user") != -1) {
    await userRouter(req, res);
  } else if (req.url.search("/api/profile") != -1) {
    await profileRouter(req, res);
  } else if (req.url.search("/api/logout") != -1) {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // czytam dane z nagłowka
      console.log("Wylogowywanie");
      let token = req.headers.authorization.split(" ")[1];
      tokenManager.invalidTokens.push(token);
      console.log(tokenManager.invalidTokens);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 200, message: "Log out" }, null, 5));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "404", message: `Invalid root` }));
  }
}).listen(process.env.APP_PORT, () => console.log(`listen on ${process.env.APP_PORT}`));
