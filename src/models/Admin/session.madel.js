import { Schema, model } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

export const sessionSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: true, versionKey: false }
);

export const Session = model(DB_CONSTANTS.SESSIONUSER, sessionSchema, DB_CONSTANTS.SESSIONUSER);