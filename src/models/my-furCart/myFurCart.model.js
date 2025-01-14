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


