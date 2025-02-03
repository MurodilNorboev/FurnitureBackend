import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Product } from "../../models/Admin/product.model.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import { OrderPayment } from "../../models/Admin/Buyurtma.model.js";

export class CartController {

  static updateCart = asyncHandler(async (req, res) => {
    const {
      userId,
      shippingMethod,
      paymentMethod,
      productId,
    } = req.body;

    // Foydalanuvchining savatini olish
    let userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product"
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

    console.log("Searching for product with ID: ", productId); // Productni ID bo'yicha qidiryapmiz
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found. Please check the product ID and try again.",
      });
    }
    

    // SubTotal va TotalCostni hisoblash
    userCart.subTotalCost = userCart.items.reduce((acc, item) => {
      if (item.product && item.product.cost) {
        const price = parseFloat(item.product.cost);
        return acc + item.quantity * price;
      }
      return acc;
    }, 0);

    // Yuk tashish qiymatini qo'shish
    const deliveryCost = shippingMethod === "FEDEX" ? 15 : 0;
    userCart.subTotalCost += deliveryCost;

    // Payment metodini qo'shish
    userCart.paymentMethod = paymentMethod;

    // Total costni hisoblash (barcha itemlar va delivery)
    userCart.totalCost = userCart.subTotalCost;

    // Cartni saqlash
    await userCart.save();

    // Yangi cartni yuborish
    res.status(200).json({
      success: true,
      cart: userCart,
      productId,
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

  // static createOrder = asyncHandler(async (req, res) => {
  //   const { userinfo, deliveryAddress } = req.body;
  //   const { userId } = req.params; // URL orqali kelgan userId

  //   // Foydalanuvchining shaxsiy ma'lumotlari tekshirilmoqda
  //   if (
  //     !userinfo ||
  //     !userinfo.first_name ||
  //     !userinfo.last_name ||
  //     !userinfo.phone_number ||
  //     !userinfo.email
  //   ) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "User information is incomplete",
  //     });
  //   }

  //   // Yetkazib berish manzili tekshirilmoqda
  //   if (
  //     !deliveryAddress ||
  //     !deliveryAddress.country ||
  //     !deliveryAddress.city ||
  //     !deliveryAddress.street ||
  //     !deliveryAddress.Appartment ||
  //     !deliveryAddress.zip_code
  //   ) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Delivery address is incomplete",
  //     });
  //   }

  //   // Foydalanuvchining savatchasini olish
  //   const userCart = await MyFurCart.findOne({ user: userId }).populate({
  //     path: 'items.product',
  //     select: 'types cost image description categories setColors'  // SetColors ham kiritilgan
  //   });    
    

  //   // Savatcha bo'sh bo'lsa, xatolikni qaytaradi
  //   if (!userCart || userCart.items.length === 0) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Savatcha bo'sh",
  //     });
  //   }

  //   // Umumiy narxlarni hisoblash
  //   const subtotal = userCart.items.reduce((acc, item) => {
  //     return acc + item.totalCost;
  //   }, 0);

  //   // Yetkazib berish narxi (shippingMethodga qarab)
  //   const deliveryCost = userCart.shippingMethod === "FEDEX" ? 15 : 0;

  //   // Umumiy narxni hisoblash
  //   const totalCost = subtotal + deliveryCost;

  //   // Buyurtma yaratish
  //   const newOrder = await OrderPayment.create({
  //     user: userId,
  //     items: userCart.items.map((item) => ({
  //       product: item.product._id,
  //       quantity: item.quantity,
  //       totalCost: item.totalCost,
  //       setColors: item.setColors || [], // Agar setColors bo'sh bo'lsa, bo'sh array qo'shish
  //     })),
  //     deliveryCost,
  //     subtotal,
  //     totalCost,
  //     userinfo,
  //     deliveryAddress,
  //     shippingMethod: userCart.shippingMethod || "SELF_PICKUP",
  //     paymentMethod: userCart.paymentMethod || "CASH",
  //   });
    
    

  //   // Javob qaytarish
  //   res.status(201).json({
  //     success: true,
  //     message: "Buyurtma muvaffaqiyatli yaratildi",
  //     order: newOrder,
  //   });
  // });

  static createOrder = asyncHandler(async (req, res) => {
    const { userinfo, deliveryAddress } = req.body;
    const { userId } = req.params; // URL orqali kelgan userId
  
    // Foydalanuvchining shaxsiy ma'lumotlari tekshirilmoqda
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
  
    // Yetkazib berish manzili tekshirilmoqda
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
    const userCart = await MyFurCart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'types cost image description categories setColors',  // SetColors ham kiritilgan
    });
  
    // Savatcha bo'sh bo'lsa, xatolikni qaytaradi
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Savatcha bo'sh",
      });
    }
  
    // Umumiy narxlarni hisoblash
    const subtotal = userCart.items.reduce((acc, item) => {
      return acc + item.totalCost;
    }, 0);
  
    // Yetkazib berish narxi (shippingMethodga qarab)
    const deliveryCost = userCart.shippingMethod === "FEDEX" ? 15 : 0;
  
    // Umumiy narxni hisoblash
    const totalCost = subtotal + deliveryCost;
  
    // Buyurtma yaratish
    const newOrder = await OrderPayment.create({
      user: userId,
      items: userCart.items.map((item) => ({
        product: item.product._id,  // To'g'ri ObjectId formatida olish
        quantity: item.quantity,
        totalCost: item.totalCost,
        setColors: item.setColors || [], // Agar setColors bo'sh bo'lsa, bo'sh array qo'shish
      })),
      deliveryCost,
      subtotal,
      totalCost,
      userinfo,
      deliveryAddress,
      shippingMethod: userCart.shippingMethod || "SELF_PICKUP",
      paymentMethod: userCart.paymentMethod || "CASH",
    });
  
    // Javob qaytarish
    res.status(201).json({
      success: true,
      message: "Buyurtma muvaffaqiyatli yaratildi",
      order: newOrder,
    });
  });
  
  static getOrderById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    // 'items.product' va 'user' uchun alohida populate metodlari
    const order = await OrderPayment.findOne({
      user: userId,
    })
    .populate({
      path: "items.product", // Productlarni populate qilish
      select: "image description categories types setColors" // Kerakli maydonlarni tanlash
    })
    .populate({
      path: "user", // Userni populate qilish
      select: "full_name lastName email phone_number address" // Kerakli maydonlarni tanlash
    });
  
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
    const { userId, orderId } = req.params;
    const { paymentMethod, cardDetails } = req.body;

    const order = await OrderPayment.findById(orderId).populate(
      "items.product"
    );
    console.log(orderId, userId, order);

    if (!order || order.user.toString() !== userId) {
      throw new Error("Buyurtma topilmadi yoki ruxsat yo'q");
    }

    if (paymentMethod === "VISA") {
      if (!cardDetails || !cardDetails.number || !cardDetails.expiry) {
        throw new Error("Karta ma'lumotlari to'liq emas");
      }
    }

    // Buyurtma holatini yangilash
    order.paymentMethod = paymentMethod;
    order.status = "PAID"; // To'lov amalga oshirildi
    await order.save();

    // Savatchani tozalash
    await MyFurCart.deleteOne({ user: userId });
    // Javob qaytarish
    res.status(200).json({
      success: true,
      message: "To'lov amalga oshirildi",
      order,
    });
  });

  static processPayment = asyncHandler(async (req, res) => {
    const { userId, orderId } = req.params;
    const { paymentMethod, cardDetails } = req.body;

    // Buyurtmani olish
    const order = await OrderPayment.findById(orderId).populate(
      "items.product"
    );
    console.log("Order ID: ", orderId);
    console.log("User ID: ", userId);
    console.log("Order: ", order);

    // Buyurtma topilmasa yoki foydalanuvchi buyurtmaga ruxsat bermasa, xatolik qaytarish
    if (!order || order.user.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Buyurtma topilmadi yoki ruxsat yo'q",
      });
    }

    // To'lov turi VISA bo'lsa, karta ma'lumotlarini tekshirish
    if (paymentMethod === "VISA") {
      if (!cardDetails || !cardDetails.number || !cardDetails.expiry) {
        return res.status(400).json({
          success: false,
          message: "Karta ma'lumotlari to'liq emas",
        });
      }
    }

    // `MyFurCart`dan `widthType` va `setColors`ni olish
    const userCart = await MyFurCart.findOne({ user: userId });
    console.log("User Cart: ", userCart);

    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "Savatcha topilmadi",
      });
    }

    // Har bir itemni yangilash: MyFurCart'dan `widthType` va `setColors`ni olish
    const updatedItems = order.items.map((item) => {
      const product = item.product;
      console.log("Item Product: ", product);

      // MyFurCart'dagi mos itemni topish
      const cartItem = userCart.items.find(
        (cartItem) => cartItem.product.toString() === product._id.toString()
      );
      console.log("Cart Item: ", cartItem);

      // `widthType` va `setColors`ni olish
      const widthType = cartItem ? cartItem.widthType : "min"; // Agar bo'lmasa, default "min"

      // `setColors`ni olish va tekshirish
      const setColors =
        cartItem && Array.isArray(cartItem.setColors) ? cartItem.setColors : []; // Agar bo'lmasa, bo'sh array

      console.log("Width Type: ", widthType);
      console.log("Set Colors: ", setColors);

      return {
        ...item.toObject(),
        widthType, // widthType MyFurCart'dan olib, OrderPaymentga qo'shamiz
        setColors, // setColors MyFurCart'dan olib, OrderPaymentga qo'shamiz
      };
    });

    // OrderPaymentni yangilash
    order.items = updatedItems;
    order.paymentMethod = paymentMethod;
    order.status = "PAID"; // To'lov amalga oshirildi
    console.log("Updated Order: ", order);

    // To'lovni saqlash
    await order.save();
    console.log("Order saved");

    // Savatchani tozalash
    // await MyFurCart.deleteOne({ user: userId });
    await MyFurCart.updateOne(
      { user: userId },
      { $pull: { items: { product: productId } } } // bu yerda faqat productga mos itemni o'chiradi
    );

    // Javob qaytarish
    res.status(200).json({
      success: true,
      message: "To'lov amalga oshirildi",
      order,
    });
  });

  /// productlar 15 kunda tozalash qilish
  static getOrders = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Buyurtmalarni olish
    const orders = await OrderPayment.find({ user: userId }).populate(
        "items.product"
    ).exec();

    // MyFurCartdan savatni olish
    const cart = await MyFurCart.findOne({ user: userId }).exec();

    // Buyurtmalarning har biri uchun tekshirish
    orders.forEach((order) => {
        order.items = order.items.filter((item) => {
            // Agar `widthType` "max" bo'lsa, faqat `maxWidth`ni tanlang
            if (item.widthType === "max") {
                return true; // Faol bo'lsin
            }
            // `minWidth` bo'lsa, uni chiqarish
            return false;
        });
    });

    // Foydalanuvchiga buyurtmalar va cartni qaytarish
    res.status(200).json({ success: true, orders, cart });
  });
}
