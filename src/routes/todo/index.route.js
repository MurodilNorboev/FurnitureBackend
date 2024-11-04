import { Router } from 'express';
export const router = Router();
import { delet, edit, get_all, get_id, todoadd } from '../../controllers/todo/todo.controler.js';
import { validate } from '../../validator/validator.js';
import { addV, updataV } from '../../validator/todo/todo.validator.js';
import { auth } from '../../middleware/auts.middleware.js'

router.post('/add', auth, addV(), validate, todoadd );   
router.put('/edit/:id', auth, updataV(), validate, edit );   // atalishi body  // almashtirish
router.get('/get/:id', auth, get_id );
router.get('/get-all/', get_all );
router.delete('/delete/:id', auth, delet );



















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