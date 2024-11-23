import { connect } from "mongoose";
import { DB_URL } from '../utils/secrets.js';

export const MONGODB_CONNECT = async () => {
    try {
        const {connections} = await connect(DB_URL);
        console.info(`DB connected! Name: ${connections[0].name}! Host: ${connections[0].host}`); 
       }
       catch ( error) {
            console.log(error);
        }
    
}

// import { connect } from "mongoose";
// import { DB_URL } from '../utils/secrets.js';

// export const MONGODB_CONNECT = async () => {
//     console.log("MongoDB URL: ", DB_URL);  // DB_URL ning qiymatini konsolga chiqarish
    
//     if (!DB_URL) {
//         console.error('DB_URL is not defined!');
//         return;
//     }

//     try {
//         // MongoDB ulanishi
//         await connect(DB_URL);
//         console.info('DB connected!');
//     } catch (error) {
//         console.log('MongoDB connection error:', error);
//     }
// };



