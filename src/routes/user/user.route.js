import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";

export const router = Router();

router.post("/sign-up", UserController.signUp);
router.post("/login", UserController.login);
router.post("/me", auth, UserController.getprofile);