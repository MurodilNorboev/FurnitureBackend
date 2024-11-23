import dotenv from 'dotenv'

dotenv.config(); // bu bolmasa dotenv ishlamaydi !! 

export const PORT = process.env.PORT || 7070;
export const ENVIROVMENT = process.env.ENVIROVMENT;
export const REG_KEY = process.env.REG_KEY;
export const DB_URL = process.env.DB_URL;   
export const JWT_SECRET = process.env.JWT_SECRET;   

// console.log(PORT, DB_URL, ENVIROVMENT, JWT_SECRET, REG_KEY);
