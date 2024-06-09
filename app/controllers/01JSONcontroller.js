import { photos, Photo, convertedTags, users } from "../model.js";
import tagsController from "./03TAGScontroller.js";
const jsonController = {
  add: (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      if (!photos.some((el) => el.name == data.name && el.album == data.album)) {
        const author = users.find((el) => el.email == data.album);
        const newPhoto = new Photo(data.id, data.album, data.name, data.path, author.name, author.lastName, data.desc);
        console.log(newPhoto);
        photos.push(newPhoto);
        jsonController.updateTag({ id: data.id, tags: data.tags });
        console.log(photos);
        resolve(newPhoto);
      } else {
        reject("Nie udało się dodać");
      }
    });
  },
  leaveLike: (data, email) => {
    return new Promise(async (resolve, reject) => {
      console.log(data.id);
      console.log(email);
      const photo = photos.find((el) => el.id == data.id);
      const user = users.find((el) => el.email == email);
      console.log(users);
      console.log(photo);
      console.log(user);
      const files = await jsonController.getAll();
      if (files) {
        if (photo && user) {
          if (photo.likes.find((el) => el == user.email)) {
            console.log("Dislike");

            photo.likes = photo.likes.filter((el) => el !== email);
            console.log(photo.likes);

            resolve({ message: "Photo disliked", files: files });
          } else {
            console.log("Like");
            photo.likes.push(email);
            console.log(photo.likes);
            resolve({ message: "Photo likes", files: files });
          }
        } else {
          reject(`Photo with id: ${data.id} not found`);
        }
      } else {
        reject(`Photo with id: ${data.id} not found`);
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
      // console.log(photos.length);
      // if (photos.length > 0) {
      resolve(photos);
      // } else {
      //   reject("Array is emptey");
      // }
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
  updateTag(data) {
    return new Promise(async (resolve, reject) => {
      const photo = photos.find((el) => el.id == data.id);
      let tags = data.tags;

      if (photo) {
        if (Array.isArray(tags)) {
          for (let tag of tags) {
            tag = tag[0] == "#" ? tag.trim() : `#${tag}`.trim();
            if (convertedTags.find((el) => el.name == tag)) {
              if (!photo.tags.find((el) => el.name == tag)) {
                photo.addTag(tag);
              } else {
                // console.log("Isnieje");
              }
            } else {
              if (!photo.tags.find((el) => el.name == tag)) {
                try {
                  await tagsController.add({ name: tag, popularity: 0 });
                  photo.addTag(tag);
                } catch {
                  // console.log("Error");
                }
              } else {
                // console.log("Isnieje");
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
              // console.log("Isnieje");
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
              // console.log("Isnieje");
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
