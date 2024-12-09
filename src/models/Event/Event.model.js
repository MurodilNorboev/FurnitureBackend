import { Schema, model } from 'mongoose';
import { DB_CONSTANTS } from '../../constants/db.constants.js';

export const eventSchema = new Schema({
    titles: {
        type: String,
        required: true
    },
    descs: {
        type: String,
        required: true 
    }
},
{timestamps: {createdAt:'sana', updatedAt:'yangilanish'}, versionKey: false}
);

export const Event = model(DB_CONSTANTS.EVENT, eventSchema, DB_CONSTANTS.EVENT);