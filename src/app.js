// io serverni yaratish
import express from "express";
import { ENVIROVMENT, PORT } from "./utils/secrets.js";
import { Routes } from "./routes/index.js";
import { MONGODB_CONNECT } from "./utils/datamase.config.js";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { readFileSync } from "fs";
import swaggerUI from "swagger-ui-express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

const app = express(),
  server = createServer(app),
  io = new SocketServer(server, {
    cors: {
      origin: [
        "https://my-furniture-store.vercel.app",
        "https://furnitureadmindashboard.vercel.app",
        "https://camping-car.vercel.app",
      ],
    },
  });

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("updateCart", (data) => io.emit("cartUpdated", data));
  socket.on("disconnect", () => console.log("Client disconnected"));
});

void MONGODB_CONNECT();
app.use(express.json(), express.urlencoded({ extended: true }), cors());

if (ENVIROVMENT === "development")
  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(
      JSON.parse(readFileSync(new URL("./swagger.json", import.meta.url)))
    )
  );
app.get("/", (req, res) => {
  res.status(200).send("✅ Server is running.!");
});

Routes.forEach(({ path, router }) => app.use(path, router));
app.use(errorMiddleware);

server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}!`));

