import { Schema, model } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const ProductSchema = new Schema(
  {
    categories: { type: String, required: true }, // furniture /// select bolishi kerak
    types: { type: String, required: true }, // sofa, table  /// select bolishi kerak
    Feature: { type: String, required: true }, // sofa/"Ergonomic design", "High-quality material", or "Multi-functional".
    SubCategories: { type: String, required: true }, // bu ham select boladi va 3 yoki 4ta data tanlanadigon boladi ya'ni turi shuncha boladi !
    StockNumber: { type: Number, required: true }, /// obmorhonada mol qancha borligi
    SpecialOffers: { type: String, required: false }, /// select boladi ! / bunda Hot, Popular, New, All boladi kotta harif bilan !
    desc1: { type: String, required: false },
    Color: { type: String, required: true }, // color // select bolishi kerak
    ColorSet: { type: [String], required: false }, // color // select bolishi kerak / yellow, red, blue, green, white, black
    Styles: { type: String, required: true }, // style /// select bolish kera
    image: { type: String, required: true },
    image1: { type: String, required: false },
    image2: { type: String, required: false },
    image3: { type: String, required: false },
    image4: { type: String, required: false },
    videos1: { type: String, required: true },
    description: { type: String, required: true }, ///
    minWidth: { type: Number, required: false }, // Min kenglik
    maxWidth: { type: Number, required: false }, // Max kenglik
    minHeight: { type: Number, required: false }, // Min balandlik
    maxHeight: { type: Number, required: false }, // Max balandlik
    ArmDimensions_HWD: { type: String, required: true }, //
    SeatDimensions_HWD: { type: String, required: true }, //
    LegHeight_CM: { type: Number, required: true }, ///
    PackagingDimensions: { type: String, required: true }, ///
    Weight_KG: { type: Number, required: true }, ///
    Assembly: { type: String, required: true }, ///
    material: { type: String, required: true }, // material /// select bolishi kerak
    NumberOfSeats: { type: String, required: true }, ///
    CaringInstructions: { type: String, required: true }, ///
    cost: { type: Number, required: true },
    bigCost: { type: Number, required: true }, ///
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
  ProductSchema,
  DB_CONSTANTS.PRODUCTS
);
