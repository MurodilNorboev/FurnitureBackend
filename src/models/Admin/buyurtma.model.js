import mongoose, { model, Schema } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_CONSTANTS.USERFUR,
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: DB_CONSTANTS.PRODUCTS,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        totalCost: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingMethod: {
      type: String,
      enum: ["FEDEX", "SELF_PICKUP"],
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "VISA"],
      required: false,
    },
    deliveryCost: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    userinfo: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      phone_number: { type: String, required: true },
      email: { type: String, required: true },
    },
    deliveryAddress: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      Appartment: { type: String, required: true },
      zip_code: { type: String, required: true },
      comment: { type: String, required: false },

    },
  },

  {
    timestamps: { createdAt: "sana", updatedAt: "yangilanish" },
    versionKey: false,
  }
);

export const OrderPayment = model(
  DB_CONSTANTS.PAYMENT,
  orderSchema,
  DB_CONSTANTS.PAYMENT
);
