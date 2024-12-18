import { Router } from 'express';
export const router = Router();

import { addSession, getAllSessions } from "../../controllers/Admin/session.controller.js";
import { authF } from '../../middleware/auts.middlewareFur.js';


/// session chart router ! 
router.post("/add", authF, addSession); // Yangi sessiya qo'shish
router.get("/", authF, getAllSessions); // Barcha sessiyalarni olish