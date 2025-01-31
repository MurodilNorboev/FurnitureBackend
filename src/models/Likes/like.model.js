import { model, Schema } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const LikeShema = new Schema(
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
  },
  { timestamps: { createdAt: "sana", updatedAt: "yangilanish" }, versionKey: false }, 
  
);

export const Likes = model(DB_CONSTANTS.LIKES, LikeShema, DB_CONSTANTS.LIKES);
