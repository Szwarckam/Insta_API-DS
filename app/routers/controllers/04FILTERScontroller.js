import { photos, Photo, formatExts } from "../model.js";
import sharp from "sharp";
import { log } from "console";
import path from "path";
const __dirname = path.resolve();
const filtersController = {
  setFilter: (data) => {
    // console.log(data);
    return new Promise(async (resolve, reject) => {
      const photoToFilter = photos.find((el) => el.id == data.id);
      // console.log("photoToFilter", photoToFilter);
      if (photoToFilter) {
        const splited = photoToFilter.url.split("\\").pop().split(".");
        // const name = splited[]
        // console.log(splited);
        let newPath = path.join(__dirname, "upload", photoToFilter.album, `${splited[0]}-${data.filter}.${splited[1]}`);
        // console.log(newPath);
        if (photoToFilter.history.find((el) => el.status == data.filter)) {
          newPath = path.join(
            __dirname,
            "upload",
            photoToFilter.album,
            `${splited[0]}-${data.filter}_${Date.now()}.${splited[1]}`
          );
        }
        switch (data.filter) {
          case "grayscale":
            // console.log(photoToFilter.url.split("."));
            await sharp(photoToFilter.url).grayscale().toFile(newPath);
            photoToFilter.updateHistory(data.filter, newPath);
            resolve(photoToFilter);
            break;
          case "rotate":
            if (data.angle) {
              await sharp(photoToFilter.url).rotate(parseInt(data.angle)).toFile(newPath);
              photoToFilter.updateHistory(data.filter, newPath);
              resolve(photoToFilter);
            } else {
              reject("Angle needed.");
            }
            break;
          case "resize":
            if (data.size?.w && data.size?.h) {
              await sharp(photoToFilter.url)
                .resize({
                  width: data.size.w,
                  height: data.size.h,
                })
                .toFile(newPath);
              photoToFilter.updateHistory(data.filter, newPath);
              resolve(photoToFilter);
              break;
            } else {
              reject("Invalid data.");
            }
          case "reformat":
            if (data.format) {
              if (formatExts.includes(data.format)) {
                newPath = path.join(
                  __dirname,
                  "upload",
                  photoToFilter.album,
                  `${splited[0]}-${data.filter}.${data.format}`
                );
                await sharp(photoToFilter.url).toFormat(data.format).toFile(newPath);
                photoToFilter.updateHistory(data.filter, newPath);
                resolve(photoToFilter);
                break;
              } else {
                reject("Invalid format.");
              }
            } else {
              reject("Invalid data.");
            }
            break;
          case "crop":
            if (data.size?.w && data.size?.h && data.size?.l && data.size?.t) {
              await sharp(photoToFilter.url)
                .extract({
                  width: parseInt(data.size?.w),
                  height: parseInt(data.size?.h),
                  left: parseInt(data.size?.l),
                  top: parseInt(data.size?.t),
                })
                .toFile(newPath);
              photoToFilter.updateHistory(data.filter, newPath);
              resolve(photoToFilter);
            } else {
              reject("Invalid data.");
            }
            break;
          case "flip":
            await sharp(photoToFilter.url).flip().toFile(newPath);
            photoToFilter.updateHistory(data.filter, newPath);
            resolve(photoToFilter);
            break;
          case "negate":
            await sharp(photoToFilter.url).negate().toFile(newPath);
            photoToFilter.updateHistory(data.filter, newPath);
            resolve(photoToFilter);
            break;
          case "tint":
            if (data.color?.r >= 0 && data.color?.b >= 0 && data.color?.g >= 0) {
              await sharp(photoToFilter.url)
                .tint({ r: data.color.r, g: data.color.g, b: data.color.b })
                .toFile(newPath);
              photoToFilter.updateHistory(data.filter, newPath);
              resolve(photoToFilter);
            } else {
              reject("Invalid data.");
            }
            break;
          default:
            reject("Invalid filter.");
            break;
        }
      } else {
        reject(`Photo with id: ${data.id} doesn't exists`);
      }
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const delPhoto = photos.find((el) => el.id == id);
      // console.log(delPhoto);
      if (delPhoto) {
        // console.log("Do usunięcia");
        delPhoto.remove();
        // console.log(photos);
        resolve(delPhoto);
      } else {
        reject("Nie udało się usunąć");
      }
    });
  },

  update: (data) => {
    const id = data.id;
    const status = data.status;
    // console.log(data);
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
    // console.log(id);
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
