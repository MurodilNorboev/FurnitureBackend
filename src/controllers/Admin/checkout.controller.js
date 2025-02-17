import { Product } from "../../models/Admin/product.model.js";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import { StatusCodes } from "http-status-codes";

export class CartController {
  static Checkout = asyncHandler(async (req, res) => {
   try {
    const { userId, shippingMethod, paymentMethod, productId } = req.body;

    // Foydalanuvchining savatini olish
    let userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product", "order.OrderItems.product"
    );

    if (!userCart) {
      userCart = new MyFurCart({
        user: userId,
        items: [],
        totalCost: 0,
        subTotalCost: 0,
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found. Please check the product ID and try again.",
      });
    }

    // SubTotal va TotalCostni hisoblash
    userCart.subTotalCost = userCart.items.reduce((acc, item) => {
      let productCost = 0;

      // WidthTypega qarab narxni belgilash
      if (item.widthType === "max") {
        productCost = parseFloat(item.product.bigCost) || 0;
      } else if (item.widthType === "min") {
        productCost = parseFloat(item.product.cost) || 0;
      }

      // Agar narx noto'g'ri bo'lsa, xato qaytarish
      if (productCost <= 0) {
        return res.status(400).json({
          success: false,
          msg: "Invalid product cost",
        });
      }

      // Narxni yangilash va totalCostni hisoblash
      item.totalCost = item.quantity * productCost;

      // SubTotalni hisoblash
      return acc + item.totalCost;
    }, 0);

    // Yuk tashish qiymatini qo'shish
    const deliveryCost = shippingMethod === "FEDEX" ? 15 : 0;
    userCart.subTotalCost += deliveryCost;

    // Total costni hisoblash (barcha itemlar va delivery)
    userCart.totalCost = userCart.subTotalCost;

    // Payment metodini qo'shish
    userCart.paymentMethod = paymentMethod;

    // ShippingMethodni qo'shish
    userCart.shippingMethod = shippingMethod;

    // Cartni saqlash
    await userCart.save();

    res.status(200).json({
      success: true,
      cart: userCart,
      totalCost: userCart.totalCost,
    });
   } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error });
   }
  });

  static GetCheckoutCart = asyncHandler(async (req, res) => {
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
}

