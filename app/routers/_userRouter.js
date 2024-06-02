import tracer from "tracer";
const logger = tracer.colorConsole();
import path from "path";

// const __dirname = path.resolve();
import getRequestData from "../utils.js";
import usersController from "../controllers/05USERScontroller.js";
import tokenManager from "../auth.js";
import { log } from "console";
const userRouter = async (request, response) => {
  if (request.url.match(/\/api\/user\/register/) && request.method == "POST") {
    //POST  rejestracja użytkownika
    console.log("Rejestracja użytkownika");

    let data = JSON.parse(await getRequestData(request));
    console.log(data);
    try {
      const userData = await usersController.registerUser(data);
      console.log(userData);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, message: "Check your email", token: userData }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.url.match(/\/api\/user\/login/) && request.method == "POST") {
    //POST  rejestracja użytkownika
    console.log("Logowanie użytkownika");
    let data = JSON.parse(await getRequestData(request));
    console.log(data);
    try {
      const userData = await usersController.loginUser(data);
      console.log(userData);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, message: "Logged in", token: userData }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.url.match(/\/api\/user\/resetpass/) && request.method == "POST") {
    //POST  reset hasła użytkownika
    console.log("reset hasła użytkownika");
    let data = JSON.parse(await getRequestData(request));
    console.log(data);
    try {
      const userData = await usersController.resetPass(data.email);
      console.log(userData);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, message: "Check your email" }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (
    request.url.match(/api\/user\/confirm\/eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*/g) &&
    request.method == "GET"
  ) {
    // /\/(\^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)
    console.log("Autoryzacja użytkownika");
    const token = request.url.split("/")[4];
    console.log(token);
    try {
      const tokenValidation = await usersController.checkAuth(token);
      response.writeHead(302, { Location: "http://localhost:5173/auth" });
      // response.writeHead(200, { "Content-Type": "application/json" });
      response.end();
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.url == "/api/user/" && request.method == "GET") {
    console.log("Pobranie listy użytkowników");

    try {
      const users = await usersController.getAll();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, length: users.length, users: users }, null, 5));
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.url.match(/\/api\/user\/changepass/) && request.method == "POST") {
    //POST  rejestracja użytkownika
    console.log("Zmiana hasła użytkownika");
    let data = JSON.parse(await getRequestData(request));
    console.log(data);
    console.log(request.headers.authorization && request.headers.authorization.startsWith("Bearer"));
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
      // czytam dane z nagłowka
      let token = request.headers.authorization.split(" ")[1];
      console.log(token);
      const isValid = tokenManager.verifyToken(token);
      console.log(isValid);
      console.log("Data", data);
      if (isValid) {
        try {
          const userData = await usersController.changePass(isValid, data.newPassword, data.oldPassword);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 200, message: userData }, null, 5));
        } catch (err) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ status: 404, message: err }, null, 5));
        }
      } else {
        response.writeHead(403, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "403", message: `Unauthorized` }));
      }
    } else {
      response.writeHead(403, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "403", message: `Unauthorized` }));
    }
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "404", message: `Invalid root` }));
  }

  // pozostałe funkcje
};

export default userRouter;
