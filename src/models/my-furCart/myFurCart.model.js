import { Schema, model } from "mongoose";
import { DB_CONSTANTS } from "../../constants/db.constants.js";

const myFurCartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DB_CONSTANTS.USERFUR,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: false,
      default: null,
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
        widthType: { type: String, required: false },
        setColors: { type: [String], required: false },
        subTotalCost: {
          type: Number,
          required: true,
          default: 0,
        },
        item_id: {
          type: Schema.Types.ObjectId,
          default: function () {
            return new mongoose.Types.ObjectId();
          },
        },
      },
    ],
    order: [
      {
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
          appartment: { type: String, required: false },
          zip_code: { type: String, required: true },
          comment: { type: String, required: false },
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
          default: "CASH",
        },
        subTotalCost: {
          type: Number,
          required: true,
          default: 0,
        },
        totalCost: {
          type: Number,
          required: true,
          default: 0,
        },
        OrderItems: [
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
            widthType: { type: String, required: false },
            setColors: { type: [String], required: false },
            item_id: {
              type: Schema.Types.ObjectId,
              default: function () {
                return new mongoose.Types.ObjectId();
              },
            },
            stripeCustomerId: {
              type: String,
              required: false,
              default: null,
            },
          },
        ],
      },
    ],
    subTotalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "VISA"],
      required: false,
      default: "CASH",
    },
    shippingMethod: {
      type: String,
      enum: ["FEDEX", "SELF_PICKUP"],
      default: "FEDEX",
      required: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
  }
);

export const MyFurCart = model(
  DB_CONSTANTS.MY_FurCART,
  myFurCartSchema,
  DB_CONSTANTS.MY_FurCART
);
