import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { validate } from "uuid";

export const router = Router();

router.post("/sign-up", signupV(),   UserController.signUp);

router.post("/login", loginV(),   UserController.login);

router.get("/me", auth, UserController.getprofile);

router.get('/user-count', UserController.getUserCount);

router.get('/all-users', auth, UserController.getAllUsers);
