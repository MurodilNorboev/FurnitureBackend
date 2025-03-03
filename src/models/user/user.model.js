import { Schema, model } from 'mongoose';
import { DB_CONSTANTS } from '../../constants/db.constants.js';

export const userSchema = new Schema({
    full_name: { 
        type: String, 
        required: true 
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
    role: {
        type: String,
        enum: ['super_admin', "admin_plus", 'admin', 'basic_admin'], 
        default: 'basic_admin',
      },
},
{timestamps: {createdAt:'sana',updatedAt:'yangilanish'}, versionKey: false}
);

export const User = model(DB_CONSTANTS.USER, userSchema, DB_CONSTANTS.USER);
