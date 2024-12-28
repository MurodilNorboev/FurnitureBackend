import { Router } from 'express';
export const router = Router();

import { auth } from '../../middleware/auts.middleware.js';
import { addCartV, addV, updataV } from '../../validator/todo/todo.validator.js';
import { Products } from '../../controllers/Admin/products.controllers.js';
import { validate } from '../../validator/validator.js';
import { authF } from '../../middleware/auts.middlewareFur.js'


router.post("/add", auth, addV(), Products.productsall);

router.get("/all", Products.product_get_all);

router.put("/edit/:id", auth, updataV(), validate, Products.productEdit);

router.delete("/delete/:id", auth, Products.delet);

router.post('/order', auth, addCartV(), validate, Products.addToCart);

router.get('/order-get', auth, Products.getCart);

router.get('/cart-count', Products.getAllCarts)

router.delete('/cart/:cartId/furniture/:furnitureId', Products.cartDelet);



