import { photos, Photo } from "./model.js";
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
};
export default jsonController;
