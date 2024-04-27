import { photos, Photo } from "../model.js";
import sharp from "sharp";
import { log } from "console";
import path from "path";
const __dirname = path.resolve();
const filtersController = {
  setFilter: (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      const photoToFilter = photos.find((el) => el.id == data.id);
      console.log("photoToFilter", photoToFilter);
      if (photoToFilter) {
        const splited = photoToFilter.url.substring(
          photoToFilter.url.lastIndexOf("\\"),
          photoToFilter.url.length.split(".")[0]
        );
        console.log(splited);
        const newPath = path.join(__dirname, "upload", photoToFilter.album, "test.png");
        console.log(newPath);
        switch (data.filter) {
          case "grayscale":
            console.log(photoToFilter.url.split("."));
            await sharp(photoToFilter.url).grayscale().toFile(newPath);
            photoToFilter.updateHistory(data.filter, newPath);
            resolve(photoToFilter);
            break;

          default:
            break;
        }
      } else {
        reject("Nie udało się dodać");
      }
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const delPhoto = photos.find((el) => el.id == id);
      console.log(delPhoto);
      if (delPhoto) {
        console.log("Do usunięcia");
        delPhoto.remove();
        console.log(photos);
        resolve(delPhoto);
      } else {
        reject("Nie udało się usunąć");
      }
    });
  },

  update: (data) => {
    const id = data.id;
    const status = data.status;
    console.log(data);
    return new Promise((resolve, reject) => {});
  },
  getMetaData: async (id) => {
    return new Promise(async (resolve, reject) => {
      const photoToFind = photos.find((el) => el.id == id);
      try {
        if (photoToFind.url) {
          let meta = await sharp(photoToFind.url).metadata();
          resolve(meta);
        } else {
          resolve("url_not_found");
        }
      } catch (err) {
        reject("Photo doesn't exists");
      }
    });
  },
  getOne: (id) => {
    console.log(id);
    return new Promise((resolve, reject) => {
      const onePhoto = photos.find((el) => el.id == id);
      if (onePhoto) {
        resolve(onePhoto);
      } else {
        reject("Nie udało się dodać");
      }
    });
  },
};
export default filtersController;
