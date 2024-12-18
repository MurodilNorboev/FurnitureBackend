import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next(); 
    }

    const messages = errors.array().map(err => err.msg).join(', '); 

    return res.status(422).json({ success: false, error: { messages } });
}