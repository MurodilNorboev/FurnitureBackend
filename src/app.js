import express from "express";
import { ENVIROVMENT, PORT } from "./utils/secrets.js"; 
import { Routes } from "./routes/index.js"; 
import { MONGODB_CONNECT } from "./utils/datamase.config.js";
import corst from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { readFileSync } from 'fs';
import swaggerUI from 'swagger-ui-express';

const server = express(); 
void MONGODB_CONNECT();
server.use(express.json()); 
server.use(express.urlencoded({ extended: true })); 
server.use(corst({}));
server.use(errorMiddleware);

if (ENVIROVMENT === 'development') {
  const apiDocs = JSON.parse(readFileSync(new URL('./swagger.json', import.meta.url)));
  server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(apiDocs));
}

Routes.forEach((item) => {
  server.use(item.path, item.router); 
});

server.listen(PORT, () => {
  console.log(`Server Run ${PORT}!`); 
});













// import express from "express";
// import { ENVIROVMENT, PORT } from "./utils/secrets.js";
// import { Routes } from "./routes/index.js";
// import { MONGODB_CONNECT } from "./utils/datamase.config.js";
// import corst from "cors";
// import { errorMiddleware } from "./middleware/error.middleware.js";
// import { readFileSync } from 'fs';
// import swaggerUI from 'swagger-ui-express';
// import http from 'http';  // http server
// import * as socketIo from 'socket.io';  // socket.io import qilish

// const server = express(); // express serverini chaqirish

// // HTTP serverini yaratish
// const httpServer = http.createServer(server);

// // Socket.io serverini sozlash
// const io = new socketIo.Server(httpServer, {  // socket.io serverini sozlash
//   cors: {
//     origin: '*', // Agar kerak bo'lsa, CORS sozlamalarini o'zgartirishingiz mumkin
//   },
// });

// // Socket.io aloqasini sozlash
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('updateCart', (data) => {
//     io.emit('cartUpdated', data); // Barcha mijozlarga xabar yuborish
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// void MONGODB_CONNECT();

// server.use(express.json());
// server.use(express.urlencoded({ extended: true }));
// server.use(corst({}));

// if (ENVIROVMENT === 'development') {
//   const apiDocs = JSON.parse(readFileSync(new URL('./swagger.json', import.meta.url)));
//   server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(apiDocs));
// }

// Routes.forEach((item) => {
//   server.use(item.path, item.router);
// });

// server.use(errorMiddleware);

// // HTTP serverni ishga tushirish
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}!`);
// });


