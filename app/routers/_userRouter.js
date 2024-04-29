import tracer from "tracer";
const logger = tracer.colorConsole();
import path from "path";

// const __dirname = path.resolve();
import getRequestData from "../utils.js";
import usersController from "../controllers/05USERScontroller.js";
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
      response.end(
        JSON.stringify({ status: 200, message: "Success, use token for authorization", token: userData }, null, 5)
      );
    } catch (err) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 404, message: err }, null, 5));
    }
  } else if (request.url.match(/\/api\/user\/login/) && request.method == "POST") {
    //POST  rejestracja użytkownika
    console.log("Rejestracja użytkownika");
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
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: 200, message: tokenValidation }, null, 5));
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
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "404", message: `Invalid root` }));
  }
  // pozostałe funkcje
};

export default userRouter;
