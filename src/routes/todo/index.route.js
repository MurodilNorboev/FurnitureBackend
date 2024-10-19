import { Router } from 'express';
export const router = Router();
import { delet, edit, get_all, get_id, todoadd } from '../../controllers/todo/todo.controler.js';

router.post('/add', todoadd );
router.put('/edit/:id', edit );
router.get('/get/:id', get_id );
router.get('/get-all/', get_all );
router.delete('/delete/:id', delet );