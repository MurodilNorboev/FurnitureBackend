import { Router } from "express";
import { CartController } from "../../controllers/Admin/payment.controller.js";
import { auth } from "../../middleware/auts.middleware.js";

export const router = Router();

router.post("/checkout",  CartController.updateCart); // checkout

router.get("/get-checkout/:userId", CartController.GetupdatedCart ); // get update

router.post("/create-order/:userId",auth, CartController.createOrder); // order

router.get("/get-orders/:userId", CartController.getOrderById); // get order

router.post("/create-payment/:userId/:orderId", auth, CartController.processPayment); // payment

router.get("/get-payment/:userId", CartController.getOrders); // get payment