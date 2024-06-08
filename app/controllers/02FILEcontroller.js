import { photos, Photo, users } from "../model.js";
import formidable from "formidable";
import { log } from "console";
import path, { join } from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import jsonController from "./01JSONcontroller.js";
const __dirname = path.resolve();

const fileController = {
  add: (data, directory) => {
    // console.log(data);

    return new Promise((resolve, reject) => {
      let form = formidable({});

      form.multiples = true;
      form.keepExtensions = true;
      form.uploadDir = path.join(__dirname, "upload");

      form.parse(data, function (err, fields, files) {
        console.log(fields);
        const albumDirectory = path.join(form.uploadDir, directory);
        const desc = fields.desc;
        console.log(fields.title);
        const title = fields.title;
        const tags = fields.tags.split(",");
        console.log(tags);
        // for (const tag of fields.tags) {
        //   tags.push()
        // }
        const id = uuidv4();

        fs.access(albumDirectory, fs.constants.F_OK, (err) => {
          if (err) {
            fs.mkdir(albumDirectory, { recursive: true }, (err) => {
              if (err) {
                reject(err);
              } else {
                const oldPath = files.file.path;
                const newPath = files.file.path.replace("upload", path.join("upload", directory));
                fs.rename(oldPath, newPath, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({
                      id: id,
                      album: directory,
                      name: title,
                      path: newPath,
                      desc: desc,
                      tags: tags,
                      // filterData: data.data,
                    });
                  }
                });
              }
            });
          } else {
            const oldPath = files.file.path;
            const newPath = files.file.path.replace("upload", path.join("upload", directory));
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  id: id,
                  album: directory,
                  name: title,
                  path: newPath,
                  desc: desc,
                  tags: tags,
                  // filterData: data.data,
                });
              }
            });
          }
        });
      });
    });
  },
  getProfileIMG(email) {
    return new Promise((resolve, reject) => {
      const user = users.find((el) => el.email == email);
      if (user) {
        console.log(path.join(__dirname, "upload", email, "profile.png"));
        const data = fs.readFileSync(path.join(__dirname, "upload", email, "profile.png"));
        resolve({ file: data, ext: "png" });
      } else {
        reject(`Profile photo, not found`);
      }
    });
  },
  getOne: (id) => {
    return new Promise((resolve, reject) => {
      const photo = photos.find((el) => el.id == id);
      if (photo) {
        const splited = photo.url.split("\\").pop().split(".");
        const data = fs.readFileSync(photo.url);
        console.log(splited[1]);
        resolve({ file: data, ext: splited[1] });
      } else {
        reject(`Photo with id: ${id}, not found`);
      }
    });
  },
  getFiltredOne: (id, filter) => {
    return new Promise((resolve, reject) => {
      const photo = photos.find((el) => el.id == id);
      if (photo) {
        const filteredPhoto = photo.history.find((el) => el.status == filter);
        if (filteredPhoto) {
          const splited = filteredPhoto.url.split("\\").pop().split(".");
          const data = fs.readFileSync(filteredPhoto.url);
          resolve({ file: data, ext: splited[1] == "jpg" ? "jpeg" : splited[1] });
        } else {
          reject(`Photo with id: ${id}, dont have filter: ${filter}`);
        }
      } else {
        reject(`Photo with id: ${id}, doesn't exists`);
      }
    });
  },
};
export default fileController;
