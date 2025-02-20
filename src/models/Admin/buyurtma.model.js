import mongoose, { model, Schema } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const PaymentSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: DB_CONSTANTS.USERFUR, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: DB_CONSTANTS.MY_FurCART, required: true },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    amount: { type: Number, required: true },
    kakaoTid: { type: String, required: true },
    kakaoRedirectUrl: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "sana", updatedAt: "yangilanish" },
    versionKey: false,
  }
);

export const Payment = model(DB_CONSTANTS.PAYMENT, PaymentSchema, DB_CONSTANTS.PAYMENT);
