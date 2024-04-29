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
      if (!users.find((el) => el.email == data.email)) {
        console.log(data.password);
        if (data.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)) {
          const pass = await passManager.encryptPass(data.password);
          const newUser = new User(data.name, data.lastName, data.email, pass);
          const token = await tokenManager.createToken(data.email);
          console.log(newUser);
          users.push(newUser);
          resolve("http://localhost:3000/api/user/confirm/" + token);
        } else {
          reject(
            "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long."
          );
        }
      } else {
        reject(`User with email: ${data.email}, exists`);
      }
    });
  },
  checkAuth: (token) => {
    return new Promise(async (resolve, reject) => {
      const valid = await tokenManager.verifyToken(token);
      if (valid) {
        const authUser = users.find((el) => el.email == valid);
        if (!authUser.auth) {
          authUser.auth = true;
          resolve(`User with email: ${authUser.email} authorized`);
        } else {
          reject(`User with email: ${authUser.email} has been authorized earlier`);
        }
      } else {
        reject("Token expired");
      }
    });
  },

  loginUser: async (data) => {
    return new Promise(async (resolve, reject) => {
      const user = users.find((el) => el.email == data.email);
      if (user) {
        if (user.auth) {
          const checkPass = await passManager.decryptPass(data.password, user.password);
          console.log(checkPass);
          if (checkPass) {
            const token = await tokenManager.createToken(user.email);
            resolve(token);
          } else {
            reject("Invalid email or password");
          }
        } else {
          reject(`User with email: ${user.email} hasn't been authorized earlier`);
        }
      } else {
        reject("Invalid email or password");
      }
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      console.log(users);
      if (users.length > 0) {
        resolve(users);
      } else {
        reject("Array is emtey");
      }
    });
  },
};
export default usersController;
