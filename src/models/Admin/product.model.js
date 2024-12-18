import { Schema, model } from 'mongoose';
import { DB_CONSTANTS } from '../../constants/db.constants.js';

// Product uchun schema
const productSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  image1: { type: String, required: true },
}, { timestamps: { createdAt: "sana", updatedAt: "yangilanish" }, versionKey: false });

// Textil uchun schema
const textilSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
}, { timestamps: { createdAt: "sana", updatedAt: "yangilanish" }, versionKey: false });

// Table uchun schema
const tableSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  material: { type: String, required: true },
  height: { type: Number, required: true },
}, { timestamps: { createdAt: "sana", updatedAt: "yangilanish" }, versionKey: false });

// Universal Model export qilish
export const Product = model(DB_CONSTANTS.PRODUCTS, productSchema, DB_CONSTANTS.PRODUCTS);
export const Textil = model(DB_CONSTANTS.TEXTILS, textilSchema, DB_CONSTANTS.TEXTILS);
export const Table = model(DB_CONSTANTS.TABLES, tableSchema, DB_CONSTANTS.TABLES);
