import { Router } from 'express';
export const router = Router();
import { addToCart, delet, edit, get_all, get_id, getCart, todoadd } from '../../controllers/todo/todo.controler.js';
import { validate } from '../../validator/validator.js';
import { addCartV, addV, updataV } from '../../validator/todo/todo.validator.js';
import { auth } from '../../middleware/auts.middleware.js'
// validate,
router.post('/add', auth, addV(), validate, todoadd);   

router.put('/edit/:id', auth, updataV(), validate, edit );   

router.get('/get/:id', auth, get_id );

router.get('/get-all/', get_all );

router.delete('/delete/:id', auth, delet);

router.post('/order', auth, addCartV(), validate, addToCart);

router.get('/order-get', auth, getCart);

















// const test = (req, res, next) => {   bunda misol qilingan midl ver lar haqida 
//     console.log(req.body);  
//     const { title, desc } = req.body
//     if (typeof title !== 'string' || title === "" || title.length >= 5)  {
//         return res.status(400).json({success: false, msg: "Title must be a string and not empty!"})
//     } 
//     if (typeof desc !== 'string' || desc === "") {
//         return res.status(400).json({success: false, msg: "Desc must be a string and not empty!"})
//     }
//     next() 
// } /// 