import express from "express"; // express js !
import { PORT } from "./utils/secrets.js"; // secret dan olinib kelinyapti !
import { Routes } from "./routes/index.js"; // barcha malumotlarni bir joyga jamlangan joydan kelayapti !
import { MONGODB_CONNECT } from "./utils/datamase.config.js";
import corst from "cors";

const server = express(); // server chaqirip olindi !

void MONGODB_CONNECT();

server.use(express.json()); // serverni qayta tasdiqlab olyapmiz !
server.use(express.urlencoded({ extended: true })); // qayta tasdiqlab olish uchun bolmaasa ya'ni qayta tasdiqlanmasa ishga tushmadi server !
server.use(corst({}));

Routes.forEach((item) => {
  server.use(item.path, item.router); // har birini korib chiqish uchun foreach dan foydalandik !
});

server.listen(PORT, () => {
  console.log(`Server Run ${PORT}!`); // PORTni .env dan olip kelayapman va gitignore filega joyladim malumotlarni saqlab qolish uchun !
});

