import { Router } from "express";
import { StripeController } from "../../controllers/Admin/kakaoPay.controller.js";

export const router = Router();

router.post("/create-checkout-session", StripeController.createCheckoutSession);

router.get("/webhook/:userId", StripeController.getPurchasedOrders);

router.get("/getOrderList", StripeController.getOrderList)
