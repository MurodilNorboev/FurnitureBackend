import { Schema, model } from 'mongoose';
import { DB_CONSTANTS } from '../../constants/db.constants.js';

const todoSchema = new Schema({
    title: { type: String, required: true},
    desc: { type: String, required: true},
    image: { type: String, required: true},
},
{timestamps: {createdAt:'sana',updatedAt:'yangilanish'}, versionKey: false}
);

export const Todo = model(DB_CONSTANTS.TODO, todoSchema, DB_CONSTANTS.TODO);
