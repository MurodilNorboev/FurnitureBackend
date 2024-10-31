import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { validate } from "uuid";

export const router = Router();

router.post("/sign-up", signupV(),  UserController.signUp);
router.post("/login", loginV(), UserController.login);
router.get("/me", auth, UserController.getprofile);



/// sign up da muammo bor!
/// loginda faqat m dan boshlanayapti buni togirlash kerak !