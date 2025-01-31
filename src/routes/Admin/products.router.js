import { Router } from "express";
export const router = Router();

import { auth } from "../../middleware/auts.middleware.js";
import {
  addCartV,
  addV,
  updataV,
} from "../../validator/todo/todo.validator.js";
import { Products } from "../../controllers/Admin/products.controllers.js";
import { validate } from "../../validator/validator.js";
import { authF } from "../../middleware/auts.middlewareFur.js";

router.post("/add", auth, Products.productsall);

router.get("/all", Products.product_get_all);

router.put("/edit/:id", auth, updataV(), validate, Products.productEdit);

router.delete("/delete/:id", auth, Products.delet);

router.get("/with-discount", auth, Products.product_get_all_with_discount); // with discounts

router.post("/order", auth, addCartV(), validate, Products.addToCart); // add

router.get("/cart-count", Products.getAllCarts); // get all search

router.delete("/cart/:cartId/furniture/:furnitureId", Products.cartDelet);

router.post("/checkout", auth, Products.checkout);

router.get("/carts/:userId", Products.viewCart);

