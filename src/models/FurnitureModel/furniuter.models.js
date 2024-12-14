import { Schema, model } from 'mongoose';
import { DB_CONSTANTS } from '../../constants/db.constants.js';

export const FurUserSchema = new Schema({
    full_name: { 
        type: String, 
        required: true 
    },
    lastName: {
        type: String,
        required: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone_number: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    address: {
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        apartmant: { type: String, required: true },
        zip_code: { type: String, required: true }
    },
    comment: {
        type: String,
        required: false,
    }
},
{timestamps: {createdAt:'sana',updatedAt:'yangilanish'}, versionKey: false}
);

export const FurUser = model(DB_CONSTANTS.USERFUR, FurUserSchema, DB_CONSTANTS.USERFUR);
