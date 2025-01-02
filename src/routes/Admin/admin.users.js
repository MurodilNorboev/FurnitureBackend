import { Router } from "express";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { FurnitureUserController } from "../../controllers/Admin/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";
import {validate} from '../../validator/validator.js'

export const router = Router();

//// loyiha userlari ! 
router.post("/sign-up", validate, signupV(),   FurnitureUserController.signUp);

router.post("/login", loginV(),   FurnitureUserController.login);

router.get("/me", auth, FurnitureUserController.getMe);

router.put("/edit-user/:id", auth, FurnitureUserController.updateUser);

router.delete("/delet/:id", FurnitureUserController.deleteUser)

router.get('/user-count', FurnitureUserController.getUserCount);

