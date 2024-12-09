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

