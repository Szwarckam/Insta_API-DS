import { photos, Photo, convertedTags } from "../model.js";
import tagsController from "./03TAGScontroller.js";
const jsonController = {
  add: (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      if (!photos.some((el) => el.name == data.name && el.album == data.album)) {
        const newPhoto = new Photo(data.album, data.name, data.path);
        console.log(newPhoto);
        photos.push(newPhoto);
        console.log(photos);
        resolve(newPhoto);
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
    return new Promise((resolve, reject) => {
      const patPhoto = photos.find((el) => el.id == id);
      if (patPhoto) {
        patPhoto.updateHistory(status);
        resolve(patPhoto);
      } else {
        reject("Nie udało się zaktualizować");
      }
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      console.log(photos.length);
      if (photos.length > 0) {
        resolve(photos);
      } else {
        reject("Array is emptey");
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
  updateTag(data) {
    return new Promise(async (resolve, reject) => {
      const photo = photos.find((el) => el.id == data.id);
      let tags = data.tags;

      if (photo) {
        if (Array.isArray(tags)) {
          for (let tag of tags) {
            tag = tag[0] == "#" ? tag : `#${tag}`;
            if (convertedTags.find((el) => el.name == tag)) {
              if (!photo.tags.find((el) => el.name == tag)) {
                photo.addTag(tag);
              } else {
                console.log("Isnieje");
              }
            } else {
              if (!photo.tags.find((el) => el.name == tag)) {
                try {
                  await tagsController.add({ name: tag, popularity: 0 });
                  photo.addTag(tag);
                } catch {
                  console.log("Error");
                }
              } else {
                console.log("Isnieje");
              }
            }
          }
          resolve(photo);
        } else {
          tags = tags[0] == "#" ? tags : `#${tags}`;
          if (convertedTags.find((el) => el.name == tags)) {
            if (!photo.tags.find((el) => el.name == tags)) {
              photo.addTag(tags);
            } else {
              console.log("Isnieje");
            }
          } else {
            if (!photo.tags.find((el) => el.name == tags)) {
              try {
                await tagsController.add({ name: tags, popularity: 0 });
                photo.addTag(tags);
              } catch {
                resolve("Error");
              }
            } else {
              console.log("Isnieje");
            }
          }
        }
        resolve(photo);
      } else {
        reject(`Photo with id: ${data.id}, not found`);
      }
    });
  },
  getOnePhotoTags(id) {
    return new Promise((resolve, reject) => {
      const photo = photos.find((el) => el.id == id);
      if (photo) {
        resolve(photo.tags);
      } else {
        reject("Nie udało się dodać");
      }
    });
  },
};
export default jsonController;
