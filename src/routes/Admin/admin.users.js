import { Router } from "express";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { FurnitureUserController } from "../../controllers/Admin/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";
import { validate } from "../../validator/validator.js";
import { authF } from "../../middleware/auts.middlewareFur.js";
import { validationResult } from "express-validator";

export const router = Router();
// Middleware для обработки ошибок валидации
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

//// loyiha userlari !
router.post( "/sign-up", validate, signupV(), handleValidation, FurnitureUserController.signUp);
router.post("/send", FurnitureUserController.sendOTP);
router.post("/verify", FurnitureUserController.VerifyOTP);

router.post("/login", loginV(), FurnitureUserController.login);
router.post("/forgot-password", FurnitureUserController.forgotPassword);
router.post("/reset-password", FurnitureUserController.resetPassword);

router.get("/me", auth, FurnitureUserController.getMe);

router.put("/edit-user/:id", auth, FurnitureUserController.updateUser);
router.delete("/delet/:id", FurnitureUserController.deleteUser);
router.get("/user-count", FurnitureUserController.getUserCount);
