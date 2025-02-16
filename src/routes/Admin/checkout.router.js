import { Router } from "express";
import { CartController } from "../../controllers/Admin/checkout.controller.js";
import { auth } from "../../middleware/auts.middleware.js";

export const router = Router();

router.post("/checkout",  CartController.Checkout); // checkout

router.get("/get-checkout/:userId", CartController.GetCheckoutCart); // get update