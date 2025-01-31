import { Router } from "express";
import { CartController } from "../../controllers/Admin/payment.controller.js";
import { auth } from "../../middleware/auts.middleware.js";

export const router = Router();

router.post("/update",  CartController.updateCart); // update

router.get("/cart/:userId", CartController.GetupdatedCart ); // get update

router.post("/create-order/:userId",auth, CartController.createOrder); // order

router.get("/orders/:userId/", CartController.getOrderById); // get order

router.post("/order/:userId/:orderId", auth, CartController.processPayment); // payment

router.get("/order/:userId", CartController.getOrders); // get payment