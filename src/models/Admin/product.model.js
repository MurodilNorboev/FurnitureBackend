import { Schema, model } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const productSchema = new Schema(
  {
    categories: { type: String, required: true },
    types: { type: String, required: true },
    Popular: { type: String, required: true },
    issNew: { type: String, required: true },
    HotNum: { type: String, required: true },
    Hot: { type: String, required: true },
    material: { type: String, required: true },
    Color: { type: String, required: true },
    Styles: { type: String, required: true },
    Feature: { type: String, required: true },
    label: { type: String, requ234ired: true },
    isname: { type: String, required: true },
    image: { type: String, required: true },
    image1: { type: String, required: false },
    image2: { type: String, required: false },
    image3: { type: String, required: false },
    image4: { type: String, required: false },
    image5: { type: String, required: false },
    image6: { type: String, required: false },
    image7: { type: String, required: false },
    videos1: { type: String, required: true },
    desc1: { type: String, required: true },
    desc2: { type: String, required: true },
    desc3: { type: String, required: true },
    desc4: { type: String, required: true },
    desc5: { type: String, required: true },
    desc6: { type: String, required: true },
    desc7: { type: String, required: true },
    desc8: { type: String, required: true },
    Hight: { type: Number, required: true },
    Width: { type: Number, required: true },
    ArmDemensions_HWD: { type: String, required: true },
    SeatDimensions_HWD: { type: String, required: true },
    LegHeight_CM: { type: Number, required: true },
    PackagingDimensions: { type: String, required: true },
    Weight_KG: { type: Number, required: true },
    Assembly: { type: String, required: true },
    NumberOfSeats: { type: String, required: true },
    CaringInstructions: { type: String, required: true },
    description: { type: String, required: true },
    customerReviews: { type: String, required: true },
    Material: { type: String, required: true },
    Assemblys: { type: String, required: true },
    chair: { type: String, required: true },
    cost: { type: String, required: true },
    discount: { type: Number, default: 0 },
    count: { type: Number, default: 0, required: false },
  },
  {
    timestamps: { createdAt: "sana", updatedAt: "yangilanish" },
    versionKey: false,
  }
);

export const Product = model(
  DB_CONSTANTS.PRODUCTS,
  productSchema,
  DB_CONSTANTS.PRODUCTS
);
