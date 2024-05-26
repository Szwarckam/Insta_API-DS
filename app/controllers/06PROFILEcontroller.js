import { User, users } from "../model.js";
import sharp from "sharp";
import { log } from "console";
import path from "path";
import tokenManager from "../auth.js";
import passManager from "../pass.js";
import mailManager from "../mail.js";
import formidable from "formidable";
import fs from "fs";
const __dirname = path.resolve();
const profileController = {
  getProfileData: (email) => {
    // console.log(data);
    return new Promise(async (resolve, reject) => {
      const user = users.find((el) => el.email == email);
      if (user) {
        if (user.auth) {
          const data = user.getProfileData();

          resolve(data);
        } else {
          reject("Authorize your account first");
        }
      } else {
        console.log("błąd");
        reject(`User with ${email} doesn't exists.`);
      }
    });
  },
  updateProfileData(email, data) {
    return new Promise(async (resolve, reject) => {
      const user = users.find((el) => el.email == email);
      if (user) {
        if (user.auth) {
          user.name = data.name;
          user.lastName = data.lastName;
          user.bio = data.bio;
          // console.log(data);
          const profileData = user.getProfileData();
          resolve(profileData);
        } else {
          reject("Authorize your account first");
        }
      } else {
        // console.log("błąd");
        reject(`User with ${email} doesn't exists.`);
      }
    });
  },
  updateProfileIMG(directory, data) {
    console.log("Funkcja");
    return new Promise((resolve, reject) => {
      // const user = users.find((el) => el.email == email)
      const user = users.find((el) => el.email == directory);
      console.log(user);
      if (user) {
        if (user.auth) {
          let form = formidable({});

          form.multiples = true;
          form.keepExtensions = true;
          form.uploadDir = path.join(__dirname, "upload");

          form.parse(data, function (err, fields, files) {
            console.log(fields);
            const albumDirectory = path.join(form.uploadDir, directory);
            // console.log("Path", files.file.path);
            console.log(albumDirectory);
            fs.access(albumDirectory, fs.constants.F_OK, (err) => {
              if (err) {
                fs.mkdir(albumDirectory, { recursive: true }, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    const oldPath = files.file.path;
                    const newPath = path.join(__dirname, "upload", directory, "profile.png");
                    console.log(newPath);
                    fs.rename(oldPath, newPath, (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(`New profile img added`);
                      }
                    });
                  }
                });
              } else {
                const oldPath = files.file.path;
                const newPath = path.join(__dirname, "upload", directory, "profile.png");
                console.log(newPath);
                fs.rename(oldPath, newPath, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(`New profile img added`);
                  }
                });
              }
            });
          });
        } else {
          reject("Authorize your account first");
        }
      } else {
        console.log("błąd");
        reject(`User with ${directory} doesn't exists.`);
      }
    });
  },
};
export default profileController;
