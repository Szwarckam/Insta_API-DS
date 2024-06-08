import tracer from "tracer";
const logger = tracer.colorConsole();
import path from "path";

// const __dirname = path.resolve();
import getRequestData from "../utils.js";
import profileController from "../controllers/06PROFILEcontroller.js";
import tokenManager from "../auth.js";
const profileRouter = async (request, response) => {
  if (request.url.match(/\/api\/profile\/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) && request.method == "GET") {
    try {
      const email = request.url.split("/")[3];
      const profileData = await profileController.getProfileData(email);
      console.log(profileData);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, profileData: profileData }, null, 5));
    } catch (err) {
      console.log(err);
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else {
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
      // czytam dane z nagłowka
      let token = request.headers.authorization.split(" ")[1];
      console.log(token);
      token = tokenManager.verifyToken(token);
      if (request.url.match(/\/api\/profile$/) && request.method == "GET") {
        try {
          const profileData = await profileController.getMyProfileData(token);
          console.log(profileData);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, profileData: profileData }, null, 5));
        } catch (err) {
          console.log(err);
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else if (token && !tokenManager.invalidTokens.includes(token)) {
        if (request.url.match(/\/api\/profile$/) && request.method == "PATCH") {
          const data = JSON.parse(await getRequestData(request));
          console.log(data);
          try {
            const updateProfileData = await profileController.updateProfileData(token, data);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ status: 200, message: "Updated profile data", profileData: updateProfileData }, null, 5)
            );
          } catch (err) {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ status: 404, message: err }, null, 5));
          }
        } else if (request.url.match(/\/api\/profile$/) && request.method == "POST") {
          console.log("Dodanie profilowego");
          // const data = JSON.parse(await getRequestData(request));
          // console.log(data);
          try {
            const updateProfileIMG = await profileController.updateProfileIMG(token, request);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ status: 200, message: "Updated profile img", profileData: updateProfileIMG }, null, 5)
            );
          } catch (err) {
            console.log("ERROR");
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ status: 404, message: err }, null, 5));
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
  }

  // pozostałe funkcje
};

export default profileRouter;
