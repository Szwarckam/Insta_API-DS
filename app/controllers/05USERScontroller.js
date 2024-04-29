import { User, users } from "../model.js";
import sharp from "sharp";
import { log } from "console";
import path from "path";
import tokenManager from "../auth.js";
import passManager from "../pass.js";
const __dirname = path.resolve();
const usersController = {
  registerUser: (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      if (!users.find(el => el.email == data.email)) {
        console.log(data.password);
        if (data.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)) {
          const pass = await passManager.encryptPass((data.password))
          const newUser = new User(data.name, data.lastName, data.email, pass)
          const token = await tokenManager.createToken(data.email);
          console.log(newUser);
          users.push(newUser)
          resolve(token)
        } else {
          reject("Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.")
        }

      } else {
        reject(`User with email: ${data.email}, exists`)
      }
    })
  },
  checkAuth: (token) => {
    return new Promise(async (resolve, reject) => {
      const valid = await tokenManager.verifyToken(token)
      console.log(valid);
    })
  },

  update: (data) => {
  },
  getOne: (id) => {
    console.log(id);
    return new Promise((resolve, reject) => {
      resolve("t")
    });
  },
};
export default usersController;
