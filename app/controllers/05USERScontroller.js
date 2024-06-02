import { User, users } from "../model.js";
import sharp from "sharp";
import { log } from "console";
import path from "path";
import tokenManager from "../auth.js";
import passManager from "../pass.js";
import mailManager from "../mail.js";
const __dirname = path.resolve();
const usersController = {
  registerUser: (data) => {
    // console.log(data);
    return new Promise(async (resolve, reject) => {
      if (!users.find((el) => el.email == data.email)) {
        // console.log(data.password);
        if (data.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)) {
          const pass = await passManager.encryptPass(data.password);
          const newUser = new User(data.name, data.lastName, data.email, pass);
          const token = await tokenManager.createToken(data.email);

          mailManager.sendMail(
            data.email,
            "Nowe konta  na instagramie",
            `<a href='http://localhost:3000/api/user/confirm/${token}'>Aktywuj swoje konto</a>`
          );
          // console.log(newUser);
          users.push(newUser);
          resolve("Check your e-mail");
          //resolve("http://localhost:3000/api/user/confirm/" + token);
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
          // console.log(checkPass);
          if (checkPass) {
            const token = await tokenManager.createToken(user.email);
            resolve(`Bearer ${token}`);
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
      // console.log(users);
      if (users.length > 0) {
        resolve(users);
      } else {
        reject("Array is emtey");
      }
    });
  },
  changePass: (email, newPassword, oldPassword) => {
    console.log("changePass function");
    return new Promise(async (resolve, reject) => {
      const user = users.find((el) => el.email == email);
      console.log(newPassword);
      console.log(oldPassword);
      console.log(user);
      if (user) {
        if (user.auth) {
          if (newPassword.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)) {
            const checkPass = await passManager.decryptPass(oldPassword, user.password);
            if (checkPass) {
              const pass = await passManager.encryptPass(newPassword);
              user.password = pass;
              mailManager.sendMail(email, "Zmiana hasła na instagramie", `Ktoś zmienił twoje hasło na koncie`);
              resolve(`Password for user: ${email} changed.`);
            } else {
              reject("Invalid password");
            }
          } else {
            reject("Invalid password");
          }
        } else {
          reject("Authorize your account first");
        }
      } else {
        reject(`User with ${email} doesn't exists.`);
      }
    });
  },
  resetPass: (email) => {
    console.log("resetPass function");
    return new Promise(async (resolve, reject) => {
      const user = users.find((el) => el.email == email);
      if (user) {
        if (user.auth) {
          //to do generowanie hasłeł tymczasowych
          const pass = await passManager.generateTempPass();
          console.log(pass);
          const encPass = await passManager.encryptPass(pass);
          user.password = encPass;
          user.forceToChangePass = true;
          mailManager.sendMail(email, `Reset hasła na koncie`, `Witaj oto twoje jendorazowe hasło: ${pass}`);

          resolve(`Password for user: ${email} reset`);
        } else {
          reject(`Authorize your account first`);
        }
      } else {
        reject(`User with ${email} doesn't exists.`);
      }
    });
  },
};
export default usersController;
