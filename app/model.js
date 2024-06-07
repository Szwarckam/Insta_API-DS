import { FORMERR } from "dns";
import { v4 as uuidv4 } from "uuid";
import createToken from "./auth.js";
import passManager from "./pass.js";
class Photo {
  constructor(album, ogName, url, authorName, authorLastName, desc) {
    this.id = uuidv4();
    this.album = album;
    this.originalName = ogName;
    this.url = url;
    this.authorName = authorName;
    this.authorLastName = authorLastName;
    this.desc = desc;
    this.lastChange = "Original";
    this.history = [
      {
        status: "original",
        timestamp: Date.now(),
      },
    ];

    this.tags = [];
    this.likes = [];

    // this.completed = false;
  }
  remove() {
    photos = photos.filter((el) => el.id != this.id);
  }
  updateHistory(status, url) {
    this.lastChange = status;
    this.history.push({ status: status, timestamp: Date.now(), url: url });
  }
  addTag(name) {
    this.tags.push({ name: name });
  }
}

// inne potrzebne funkcje

let photos = [];

//tags

function convertTags() {
  for (let i = 0; i < rawTags.length; i++) {
    const newTag = new Tag(rawTags[i], Math.floor(Math.random() * 10000));
    convertedTags.push(newTag);
  }
  //console.log(convertedTags);
}

class Tag {
  constructor(name, popularity) {
    this.id = uuidv4();
    this.name = name;
    this.popularity = popularity;
    // this.completed = false;
  }
  remove() {
    rawTags = rawTags.filter((el) => el.id != this.id);
  }
}
let convertedTags = [];
let rawTags = [
  "#love",
  "#instagood",
  "#fashion",
  "#instagram",
  "#photooftheday",
  "#art",
  "#photography",
  "#beautiful",
  "#nature",
  "#picoftheday",
  "#travel",
  "#happy",
  "#cute",
  "#instadaily",
  "#style",
  "#tbt",
  "#repost",
  "#followme",
  "#summer",
  "#reels",
  "#like4like",
  "#beauty",
  "#fitness",
  "#food",
];

convertTags();

// Użytkownicy

let users = [];

class User {
  constructor(name, lastName, email, password) {
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.auth = false;
    this.forceToChangePass = false;
    this.bio = "";
  }
  getProfileData() {
    return { name: this.name, lastName: this.lastName, email: this.email, bio: this.bio };
  }
}

async function addAdmin() {
  const pass = await passManager.encryptPass("zaq1@WSX");
  const newAdmin = new User("Admin", "Admin", "admin@insta.pl", pass);
  newAdmin.auth = true;
  newAdmin.bio = "Testowy administrator";
  users.push(newAdmin);
}

addAdmin();
const formatExts = ["png", "gif", "jpeg", "jpg", "avif", "webp"];

export { photos, Photo, rawTags, Tag, convertedTags, convertTags, users, User, formatExts };
