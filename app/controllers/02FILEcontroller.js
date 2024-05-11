import { photos, Photo } from "../model.js";
import formidable from "formidable";
import { log } from "console";
import path, { join } from "path";
import fs from "fs";
const __dirname = path.resolve();
const fileController = {
  add: (data) => {
    // console.log(data);

    return new Promise((resolve, reject) => {
      let form = formidable({});

      form.multiples = true;
      form.keepExtensions = true;
      form.uploadDir = path.join(__dirname, "upload");

      form.parse(data, function (err, fields, files) {
        const albumDirectory = path.join(form.uploadDir, fields.album);

        fs.access(albumDirectory, fs.constants.F_OK, (err) => {
          if (err) {
            fs.mkdir(albumDirectory, { recursive: true }, (err) => {
              if (err) {
                reject(err);
              } else {
                const oldPath = files.file.path;
                const newPath = files.file.path.replace("upload", path.join("upload", fields.album));
                fs.rename(oldPath, newPath, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({ album: fields.album, name: files.file.name, path: newPath });
                  }
                });
              }
            });
          } else {
            const oldPath = files.file.path;
            const newPath = files.file.path.replace("upload", path.join("upload", fields.album));
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({ album: fields.album, name: files.file.name, path: newPath });
              }
            });
          }
        });
      });
    });
  },
  delete: (id) => {},
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
