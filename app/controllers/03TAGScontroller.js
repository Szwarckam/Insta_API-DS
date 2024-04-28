import { convertTags, convertedTags, Tag, rawTags } from "../model.js";
const tagsController = {
  add: (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      if (data.name[0] !== "#") {
        data.name = `#${data.name}`;
      }
      if (!convertedTags.some((el) => el.name == data.name)) {
        const newTag = new Tag(data.name, data.popularity);
        console.log(newTag);
        resolve(newTag);
        convertedTags.push(newTag);
        //rawTags.push(newTag.name);
        // convertTags();
        console.log(convertedTags);
      } else {
        reject(`Tag ${data.name} exists`);
      }
    });
  },
  // delete: (id) => {
  // return new Promise((resolve, reject) => {
  //   const delPhoto = photos.find((el) => el.id == id);
  //   console.log(delPhoto);
  //   if (delPhoto) {
  //     console.log("Do usunięcia");
  //     delPhoto.remove();
  //     console.log(photos);
  //     resolve(delPhoto);
  //   } else {
  //     reject(`Can't delete the tag`);
  //   }
  // });
  // },

  update: (data) => {
    // const id = data.id;
    // const status = data.status;
    // console.log(data);
    // return new Promise((resolve, reject) => {
    //   const patPhoto = photos.find((el) => el.id == id);
    //   if (patPhoto) {
    //     patPhoto.updateHistory(status);
    //     resolve(patPhoto);
    //   } else {
    //     reject("Nie udało się zaktualizować");
    //   }
    // });
  },
  getAllCnverted: () => {
    return new Promise((resolve, reject) => {
      console.log(convertedTags.length);
      if (convertedTags.length > 0) {
        resolve(convertedTags);
      } else {
        reject("Array is emptey");
      }
    });
  },

  getAllRaw: () => {
    return new Promise((resolve, reject) => {
      let tempTagArr = [];
      for (const tag of convertedTags) {
        tempTagArr.push(tag.name);
      }
      if (tempTagArr.length > 0) {
        resolve(tempTagArr);
      } else {
        reject("Array is emptey");
      }
    });
  },
  getOne: (id) => {
    console.log(id);
    return new Promise((resolve, reject) => {
      const oneTag = convertedTags.find((el) => el.id == id);
      if (oneTag) {
        resolve(oneTag);
      } else {
        reject(`Tag with id: ${id}, not found`);
      }
    });
  },
};
export default tagsController;
