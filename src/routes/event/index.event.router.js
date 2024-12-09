import { Router } from 'express';
export const router = Router();

import { auth } from '../../middleware/auts.middleware.js'

import { createEvent, getEvent } from '../../controllers/Event/event.controllers.js';
import { EventAddV } from '../../validator/todo/todo.validator.js';

router.post('/create', auth, EventAddV(), createEvent);

router.get('/events', auth,  getEvent);