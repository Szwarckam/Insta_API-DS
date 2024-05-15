import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import bcryptjs from "bcryptjs";
import { generate } from "generate-password";
const { hash, compare } = bcryptjs;

const { sign, verify } = jsonwebtoken;

const passManager = {
  encryptPass: async (password) => {
    let encryptedPassword = await hash(password, 10);
    // console.log({ encryptedPassword: encryptedPassword });
    return encryptedPassword;
  },
  decryptPass: async (userpass, encrypted) => {
    let decrypted = await compare(userpass, encrypted);
    // console.log(decrypted);
    return decrypted;
  },
  generateTempPass: async () => {
    const pass = generate({
      length: 10,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      strict: true,
    });
    console.log(pass);
    return pass;
  },
};

export default passManager;
