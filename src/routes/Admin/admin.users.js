import { Router } from "express";
import { loginV, signupV } from "../../validator/todo/todo.validator.js";
import { FurnitureUserController } from "../../controllers/Admin/user.controller.js";
import { auth } from "../../middleware/auts.middleware.js";
import { validate } from "../../validator/validator.js";
import { authF } from "../../middleware/auts.middlewareFur.js";
import { validationResult } from "express-validator";
import checkRole from "../../middleware/role.middleware.js";

export const router = Router();

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
router.post("/verify", FurnitureUserController.VerifyOTP);
router.post("/login", loginV(), FurnitureUserController.login);

router.post("/forgot-password", FurnitureUserController.forgotPassword);
router.post("/reset-password", FurnitureUserController.resetPassword);
router.post("/change-password", FurnitureUserController.changePassword)

router.get("/me", auth, FurnitureUserController.getMe);
router.put("/edit-user/:id", auth, FurnitureUserController.updateUser);
router.delete("/delet/:id", authF, checkRole("manage_data"), FurnitureUserController.deleteUser);

router.get("/user-count", FurnitureUserController.getUserCount);
router.get("/trends", FurnitureUserController.getUserTrends); // 📊 Foydalanuvchilar tendensiyasi
router.get("/locations", FurnitureUserController.getUserLocations); // 🌍 Userlar mamlakatlari
router.get("/real-time", FurnitureUserController.getRealTimeUsers); // 🔴 Real-time monitoring