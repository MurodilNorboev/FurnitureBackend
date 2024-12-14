import { Router } from "express";
import { FurnitureUserController } from "../../controllers/FurnitureUsers/user.controller.js";
import { loginV, signupV } from "../../validator/Furniture/FurValidator.js";
import { authF } from "../../middleware/auts.middlewareFur.js";
export const router = Router();

router.post("/sign-up", signupV(),   FurnitureUserController.signUp);

router.post("/login", loginV(),   FurnitureUserController.login);

router.get("/me", authF, FurnitureUserController.getMe);

router.put("/edit-user/:id", authF, FurnitureUserController.updateUser)

router.get("countries", FurnitureUserController.location)