import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller.js";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { validate } from "../../validator/validator.js";
import { authF } from "../../middleware/auts.middlewareFur.js";
import checkRole from "../../middleware/role.middleware.js";

export const router = Router();

router.post("/login", loginV(), UserController.login);
router.post("/add-user", authF, checkRole("manage_users"), UserController.addUser );
router.delete("/delete-admin/:adminId", authF, checkRole("manage_users"), UserController.deleteAdmin );
router.get("/me", authF, UserController.getprofile);
router.get("/user-Statistics", authF, checkRole("view_statistics"), UserController.userStatistics);
