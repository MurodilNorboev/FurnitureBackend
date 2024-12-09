import { Schema, model } from 'mongoose';
import { DB_CONSTANTS } from '../../constants/db.constants.js';

const myCartSchema = new Schema({
    user: { type: 
        Schema.Types.ObjectId, 
        ref: DB_CONSTANTS.USER, 
        required: true 
    },
    cars: { 
        type: [Schema.Types.ObjectId], 
        ref: DB_CONSTANTS.TODO, 
        required: true
    },
},
{timestamps: {createdAt:'sana',updatedAt:'yangilanish'}, versionKey: false}
);

export const MyCart = model(DB_CONSTANTS.MY_CART, myCartSchema, DB_CONSTANTS.MY_CART);
