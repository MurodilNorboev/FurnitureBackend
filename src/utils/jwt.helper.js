// import pkg from 'jsonwebtoken';
// const { sign, verify } = pkg;
// dotenv.config();

// export class JwtHelper {
//     static sign = async (id) => {
//         return sign({id}, JWT_SECRET, {expiresIn: '24h'})
//     };
//     static verify = (token) => {
//         return verify(token, JWT_SECRET);
//     }
// }
import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 
const { sign, verify } = pkg;
const JWT_SECRET = process.env.JWT_SECRET; 

export class JwtHelper {
    static sign = async (id) => {
        return sign({ id }, JWT_SECRET, { expiresIn: '24h' });
    };

    static verify = (token) => {
        return verify(token, JWT_SECRET);
    };
}
