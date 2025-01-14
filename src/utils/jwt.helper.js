import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { sign, verify } = pkg;
const JWT_SECRET = process.env.JWT_SECRET;

export class JwtHelper {
    static sign = async (id, role) => {
        return sign({ id, role }, JWT_SECRET, { expiresIn: '180d' }); 
    };

    static verify = (token) => {
        return verify(token, JWT_SECRET);
    };
}



// import pkg from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// const { sign, verify } = pkg;
// const JWT_SECRET = process.env.JWT_SECRET;

// export class JwtHelper {
//     static sign = async (id, role) => {
//         const token = sign({ id, role }, JWT_SECRET, { expiresIn: '180d' });
//         console.log("Yaratilgan token:", token);  // Tokenni konsolga chiqarish
//         return token;
//     };

//     static verify = (token) => {
//         try {
//             const decoded = verify(token, JWT_SECRET);
//             console.log("Dekodlangan token:", decoded);  // Token dekodlanganini konsolga chiqarish
//             return decoded;
//         } catch (error) {
//             console.log("Tokenni tekshirishda xato:", error.message);  // Xatolikni konsolga chiqarish
//             throw error;  // Xatolikni qaytarish
//         }
//     };
// }




















// // import pkg from 'jsonwebtoken';
// // import dotenv from 'dotenv';

// // dotenv.config(); 

// // const { sign, verify } = pkg;
// // const JWT_SECRET = process.env.JWT_SECRET; 

// // export class JwtHelper {
// //     static sign = async (id) => {
// //         return sign({ id }, JWT_SECRET, { expiresIn: '24h' });
// //     };

// //     static verify = (token) => {
// //         return verify(token, JWT_SECRET);
// //     };
// // }
