import { Router } from 'express';
export const router = Router();

import { createEvent, getEvent } from '../../controllers/Admin/event.controllers.js';
import { EventAddV } from '../../validator/todo/todo.validator.js';
import { auth } from '../../middleware/auts.middleware.js';

// userlarni korsatib turuvchi conrotoller routeri ! 
router.post('/create', auth, EventAddV(), createEvent);
router.get('/events', auth,  getEvent);