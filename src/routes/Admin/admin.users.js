import { Router } from "express";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { validate } from "uuid";
import { authF } from "../../middleware/auts.middlewareFur.js";
import { FurnitureUserController } from "../../controllers/Admin/user.controller.js";

export const router = Router();

//// loyiha userlari ! 
router.post("/sign-up", signupV(),   FurnitureUserController.signUp);

router.post("/login", loginV(),   FurnitureUserController.login);

router.get("/me", authF, FurnitureUserController.getMe);

router.put("/edit-user/:id", authF, FurnitureUserController.updateUser)

router.get("countries", FurnitureUserController.location)