import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller.js";

export const router = Router();

router.post("/sign-up", UserController.signUp);
router.post("/login", UserController.login);