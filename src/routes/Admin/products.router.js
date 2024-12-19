import { Router } from 'express';
export const router = Router();

import { auth } from '../../middleware/auts.middleware.js';
import { addV, updataV } from '../../validator/todo/todo.validator.js';
import { productsall,productEdit,  product_get_all, delet } from '../../controllers/Admin/products.controllers.js';
import { validate } from '../../validator/validator.js';


router.post("/add", auth, addV(), productsall);
router.get("/all", product_get_all);
router.put("/edit/:id", auth, updataV(), validate, productEdit);
router.delete("/delete/:id", auth, delet);

