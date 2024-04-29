import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import bcryptjs from 'bcryptjs';
const { hash, compare } = bcryptjs;

const { sign, verify } = jsonwebtoken;

const tokenManager = {
    createToken: async (email) => {

        let token = await sign(
            {
                email: email,
            },
            process.env.SERVER_KEY, // key powinien być zapisany w .env
            {
                expiresIn: "30s" // "1m", "1d", "24h"
            }
        );
        console.log({ token: token });
        return token
    },
    verifyToken: (token) => {

        try {
            let decoded = verify(token, process.env.SERVER_KEY)
            console.log({ decoded: decoded });
        }
        catch (ex) {
            console.log({ message: ex.message });
        }
    }
}








export default tokenManager;
