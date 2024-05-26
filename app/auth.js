import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;

const { sign, verify } = jsonwebtoken;

const tokenManager = {
  invalidTokens: [],
  createToken: async (email) => {
    let token = await sign(
      {
        email: email,
        time: Date.now(),
      },
      process.env.SERVER_KEY, // key powinien być zapisany w .env
      {
        expiresIn: "24h", // "1m", "1d", "24h"
      }
    );
    // console.log({ token: token });
    return token;
  },
  verifyToken: (token) => {
    try {
      let decoded = verify(token, process.env.SERVER_KEY);
      //   console.log({ decoded: decoded });
      return decoded.email;
    } catch (ex) {
      //   console.log({ message: ex.message });
      return false;
    }
  },
};

export default tokenManager;
