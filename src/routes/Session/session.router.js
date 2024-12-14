import { Router } from 'express';
export const router = Router();
import { addSession, getAllSessions } from "../../controllers/SessionChart/session.controller.js";
import { auth } from "../../middleware/auts.middleware.js";

export const SessionRouter = Router();

router.post("/add", auth, addSession); // Yangi sessiya qo'shish
router.get("/", auth, getAllSessions); // Barcha sessiyalarni olish