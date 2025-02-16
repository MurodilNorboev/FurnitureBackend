import { Router } from "express";
import { OrderController } from "../../controllers/Admin/order.controller.js";

export const router = Router();

router.post("/create-order", OrderController.CreateOrder); // order

router.get("/get-orders/:userId", OrderController.GetOrder); // get order