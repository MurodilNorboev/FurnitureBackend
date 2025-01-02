import { Router } from 'express';
export const router = Router();

import { addSession, getAllSessions } from "../../controllers/Admin/session.controller.js";
import { authF } from '../../middleware/auts.middlewareFur.js';
import { auth } from '../../middleware/auts.middleware.js';


/// session chart router ! 
router.post("/add", auth, addSession); // Yangi sessiya qo'shish
router.get("/", auth, getAllSessions); // Barcha sessiyalarni olish