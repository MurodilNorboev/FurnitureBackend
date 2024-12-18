import { Router } from "express";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { authF } from "../../middleware/auts.middlewareFur.js";
import { FurnitureUserController } from "../../controllers/Admin/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";
import {validate} from '../../validator/validator.js'

export const router = Router();

//// loyiha userlari ! 
router.post("/sign-up", validate, signupV(),   FurnitureUserController.signUp);

router.post("/login", loginV(),   FurnitureUserController.login);

router.get("/me", authF, FurnitureUserController.getMe);

router.put("/edit-user/:id", authF, FurnitureUserController.updateUser);

router.get("countries", FurnitureUserController.location);

router.get('/user-count', FurnitureUserController.getUserCount);

router.get('/all-users', auth, FurnitureUserController.getAllUsers);