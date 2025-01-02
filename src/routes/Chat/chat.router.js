import { Router } from "express";
import { MyChat } from "../../controllers/Chat/chat.controller.js";

export const router = Router();

router.post('/register', MyChat.Chats);