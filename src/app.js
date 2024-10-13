import express from 'express';
import { PORT } from './utils/secrets.js';
import { Routes } from './routes/index.js'
const server = express();
server.use(express.json()) 
server.use(express.urlencoded({ extended: true })) 

Routes.forEach((item) => {
    server.use(item.path, item.router );
});
server.listen(PORT, () => {
    console.log(`Server Run ${PORT}!`); 
});



