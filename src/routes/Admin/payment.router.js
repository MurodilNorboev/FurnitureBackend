import { Router } from "express";
import { CartController } from "../../controllers/Admin/payment.controller.js";

export const router = Router();

router.post("/update", CartController.updateCart);

router.get("/cart/:userId", CartController.GetupdatedCart );

router.post("/create-order", CartController.createOrder);

router.get("/orders/:userId/:orderId", CartController.getOrderById);

router.post("/order/:userId/:orderId", CartController.processPayment);

router.get("/order/:userId", CartController.getOrders);
