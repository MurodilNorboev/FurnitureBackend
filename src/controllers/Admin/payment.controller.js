import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Product } from "../../models/Admin/product.model.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import { OrderPayment } from "../../models/Admin/Buyurtma.model.js";

export class CartController {
  static updateCart = asyncHandler(async (req, res) => {
    const { userId, shippingMethod, paymentMethod, productId, quantity } =
      req.body;

    let userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!userCart) {
      userCart = new MyFurCart({ user: userId, items: [], totalCost: 0 });
    }

    if (productId && quantity) {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      userCart.items.push({
        product: productId,
        quantity: quantity,
        totalCost: parseFloat(product.cost) * quantity,
      });
    }

    userCart.totalCost = userCart.items.reduce((acc, item) => {
      if (item.product && item.product.cost) {
        const price = parseFloat(item.product.cost);
        return acc + item.quantity * price;
      }
      return acc;
    }, 0);

    const deliveryCost = shippingMethod === "FEDEX" ? 15 : 0;
    userCart.totalCost += deliveryCost;

    userCart.paymentMethod = paymentMethod;

    await userCart.save();

    res.status(200).json({
      success: true,
      cart: userCart,
      totalCost: userCart.totalCost,
    });
  });

  static GetupdatedCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    res.status(200).json({
      success: true,
      cart: userCart,
      totalCost: userCart.totalCost,
    });
  });

  static createOrder = asyncHandler(async (req, res) => {
    const { userId, userinfo, deliveryAddress } = req.body;

    if (
      !userinfo ||
      !userinfo.first_name ||
      !userinfo.last_name ||
      !userinfo.phone_number ||
      !userinfo.email
    ) {
      return res.status(400).json({
        success: false,
        message: "User information is incomplete",
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.country ||
      !deliveryAddress.city ||
      !deliveryAddress.street ||
      !deliveryAddress.Appartment ||
      !deliveryAddress.zip_code
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is incomplete",
      });
    }

    // Foydalanuvchining savatchasini olish
    const userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product"
    );

    // Savatcha bo'sh bo'lsa, xatolikni qaytaradi
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Savatcha bo'sh",
      });
    }

    // Umumiy narxlarni hisoblash
    const subtotal = userCart.totalCost;
    const deliveryCost = 0; // Yetkazib berish narxi (bu holatda 0 deb belgilangan)
    const totalCost = subtotal + deliveryCost;

    // Buyurtma yaratish
    const newOrder = await OrderPayment.create({
      user: userId,
      items: userCart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        totalCost: item.totalCost,
      })),
      deliveryCost,
      subtotal,
      totalCost,
      userinfo,
      deliveryAddress,
      shippingMethod: userCart.shippingMethod || "SELF_PICKUP",
      paymentMethod: userCart.paymentMethod || "CASH",
    });

    // Savatchani tozalash
    await MyFurCart.deleteOne({ user: userId });

    // Javob qaytarish
    res.status(201).json({
      success: true,
      message: "Buyurtma muvaffaqiyatli yaratildi",
      order: newOrder,
    });
  });

  static getOrderById = asyncHandler(async (req, res) => {
    const { userId, orderId } = req.params;

    const order = await OrderPayment.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or User has no orders",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  });

  static processPayment = asyncHandler(async (req, res) => {
    const { userId, orderId } = req.params; // URL parametrlaridan olish
    const { paymentMethod, cardDetails } = req.body; // Qolgan ma'lumotlarni bodydan olish

    // Buyurtmani bazadan olish
    const order = await OrderPayment.findById(orderId);

    if (!order || order.user.toString() !== userId) {
      throw new Error("Buyurtma topilmadi yoki ruxsat yo'q");
    }

    // Karta ma'lumotlarini tekshirish
    if (paymentMethod === "VISA") {
      if (!cardDetails || !cardDetails.number || !cardDetails.expiry) {
        throw new Error("Karta ma'lumotlari to'liq emas");
      }
    }

    // Buyurtma holatini yangilash
    order.paymentMethod = paymentMethod;
    order.status = "PAID"; // To'lov amalga oshirildi
    await order.save();

    // Javob qaytarish
    res.status(200).json({
      success: true,
      message: "To'lov amalga oshirildi",
      order,
    });
  });

  static getOrders = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const orders = await OrderPayment.find({ user: userId }).populate(
      "items.product"
    );

    res.status(200).json({ success: true, orders });
  });
}
