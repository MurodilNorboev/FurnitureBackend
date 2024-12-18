import { Schema, model } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

export const sessionSchema = new Schema(
  {
    date: { 
      type: Date,  // Sana tipini Date qilib belgilash
      required: true,
    },
    direct: { type: Number, required: true },
    referral: { type: Number, required: true },
    organic: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Session = model(DB_CONSTANTS.SESSIONUSER, sessionSchema, DB_CONSTANTS.SESSIONUSER);