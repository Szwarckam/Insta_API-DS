import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import bcryptjs from 'bcryptjs';
const { hash, compare } = bcryptjs;

const { sign, verify } = jsonwebtoken;

const passManager = {

    encryptPass: async (password) => {

        let encryptedPassword = await hash(password, 10);
        // console.log({ encryptedPassword: encryptedPassword });
        return encryptedPassword;
    },
    decryptPass: async (userpass, encrypted) => {

        let decrypted = await compare(userpass, encrypted)
        // console.log(decrypted);
        return decrypted

    }
}








export default passManager;
