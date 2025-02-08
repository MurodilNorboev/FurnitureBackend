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
import checkRole from "../../middleware/role.middleware.js";

router.post("/add", authF, checkRole('manage_data'), Products.productsall);
router.get("/all", Products.product_get_all);
router.put("/edit/:id", authF, checkRole('manage_data'), updataV(), validate, Products.productEdit);
router.delete("/delete/:id", authF, checkRole('manage_data'), Products.delet);
router.get("/with-discount", authF, Products.product_get_all_with_discount); // with discounts

// add Cart
router.post("/order", authF, addCartV(), validate, Products.addToCart); // add
router.get("/cart-count", Products.getAllCarts); // get all search 
router.delete("/delete", auth, Products.deletCart);
router.post("/update", auth, Products.updateCartItem); // update POST
router.get("/get-updated/:userId", Products.viewCart); // view cart GET

