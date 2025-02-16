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

// const orderSchema = new Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: DB_CONSTANTS.USERFUR,
//       required: true,
//     },
//     items: [
//       {
//         product: {
//           type: Schema.Types.ObjectId,
//           ref: DB_CONSTANTS.MY_FurCART,
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           default: 1,
//         },
//         totalCost: {
//           type: Number,
//           required: true,
//           default: 0,
//         },
//         widthType: { type: String, required: false },
//         setColors: { type: [String], required: false },
//       },
//     ],
//     subTotalCost: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     shippingMethod: {
//       type: String,
//       enum: ["FEDEX", "SELF_PICKUP"],
//       required: false,
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["CASH", "VISA"],
//       required: false,
//       default: "CASH",
//     },
//     userinfo: {
//       first_name: { type: String, required: true },
//       last_name: { type: String, required: true },
//       phone_number: { type: String, required: true },
//       email: { type: String, required: true },
//     },
//     deliveryAddress: {
//       country: { type: String, required: true },
//       city: { type: String, required: true },
//       street: { type: String, required: true },
//       Appartment: { type: String, required: true },
//       zip_code: { type: String, required: true },
//       comment: { type: String, required: false },

//     },
//   },

//   {
//     timestamps: { createdAt: "sana", updatedAt: "yangilanish" },
//     versionKey: false,
//   }
// );
// export const OrderPayment = model(
//   DB_CONSTANTS.PAYMENT,
//   orderSchema,
//   DB_CONSTANTS.PAYMENT
// );