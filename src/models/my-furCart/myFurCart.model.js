import { Schema, model } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const myMebelShema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DB_CONSTANTS.USERFUR,
      required: true,
    },
    furniture: {
      type: [Schema.Types.ObjectId],
      ref: DB_CONSTANTS.PRODUCTS,
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
          // Price
          type: Number,
          required: true,
          default: 0,
        },
        widthType: { type: String, required: false },
        setColors: { type: [String], required: false },
      },
    ],
    subTotalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "VISA/MASTERCARD"],
      required: false,
      default: "CASH",
    },
    setColors: [{ type: String }], // ✅ Ranglar string array bo‘lishi kerak!
    widthType: { type: String, enum: ["min", "max"], default: "min" },
  },
  {
    timestamps: { createdAt: "sana", updatedAt: "yangilanish" },
    versionKey: false,
  }
);

export const MyFurCart = model(
  DB_CONSTANTS.MY_FurCART,
  myMebelShema,
  DB_CONSTANTS.MY_FurCART
);

// addcart qilayotganda ikkita button boladi bular: minWidth,Height/// maxWidth,Height boladi bu juftliklarni birini tanlaganda  minWidth,Height tanlaganda narh cost boyicha hisoblaydi agarda maxWidth,Height bolsa BigCost bilan hisoblaydigon bolishi kerak boladi shu narsani qilsak boladimi?
