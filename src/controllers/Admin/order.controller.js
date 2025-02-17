import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import mongoose from "mongoose";

export class OrderController {
  static CreateOrder = asyncHandler(async (req, res) => {
    try {
      const { userId, deliveryAddress, userinfo } = req.body;
      console.log("userId: ", userId);

      const userID = new mongoose.Types.ObjectId(userId);
      console.log("userID: ", userID);

      // **Foydalanuvchining savatini olish**
      let userCart = await MyFurCart.findOne({ user: userId }).populate(
        "items.product",
        "OrderItems.product"
      );

      if (!userCart || userCart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty or not found!",
        });
      }

      // **paymentMethod va shippingMethodni MyFurCartdan olish**
      let paymentMethod = userCart.paymentMethod;
      let shippingMethod = userCart.shippingMethod;

      // **Buyurtma uchun vaqtinchalik obyekt yaratish**
      const tempOrder = {
        userinfo,
        deliveryAddress,
        shippingMethod,
        paymentMethod,
        subTotalCost: userCart.subTotalCost,
        totalCost: userCart.totalCost,
        OrderItems: userCart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          totalCost: item.totalCost,
          widthType: item.widthType,
          setColors: item.setColors,
          item_id: item.item_id,
        })),
      };

      // **Orderni qo'shish va saqlash**
      userCart.order.push(tempOrder);

      // **Savatdagi itemlarni tozalash (bo'shatish)**
      userCart.items = [];

      // **Agar savatdagi itemlar bo'sh bo'lsa, furniture ni ham tozalash**
      if (userCart.items.length === 0) {
        userCart.furniture = []; // furniture ni tozalash
      }

      await userCart.save();

      // **Orderni qayta olish va populate qilish**
      const updatedCart = await MyFurCart.findOne({ user: userId }).populate(
        "order.OrderItems.product"
      );

      const newOrder = updatedCart.order[updatedCart.order.length - 1]; // Yangi orderni olish

      res.status(201).json({
        success: true,
        message: "Order successfully created!",
        order: newOrder,
      });
    } catch (error) {
      console.error("CreateOrder error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error!",
        error: error.message,
      });
    }
  });

  static GetOrder = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid userId format!",
      });
    }

    const updatedCart = await MyFurCart.findOne({ user: userId }).populate(
      "order.OrderItems.product"
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order successfully retrieved!",
      order: updatedCart.order,
    });
  });
}
