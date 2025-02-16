import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import mongoose from "mongoose";
import { Product } from "../../models/Admin/product.model.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import moment from "moment";
import { FurUser } from "../../models/Admin/user.models.js";
import jwt from 'jsonwebtoken';

export class Products {
  static productsall = asyncHandler(async (req, res) => {
    const {
      categories,
      types,
      Feature,
      SubCategories,
      StockNumber,
      SpecialOffers,
      desc1,
      desc2,
      desc3,
      desc4,
      Color,
      ColorSet,
      Styles,
      image,
      image1,
      image2,
      image3,
      image4,
      videos1,
      description,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      ArmDimensions_HWD,
      SeatDimensions_HWD,
      LegHeight_CM,
      PackagingDimensions,
      Weight_KG,
      Assembly,
      NumberOfSeats,
      CaringInstructions,
      material,
      cost,
      bigCost,
      discount,
      count,
    } = req.body;

    const new_todo = await Product.create({
      categories,
      types,
      Feature,
      SubCategories,
      StockNumber,
      SpecialOffers,
      desc1,
      desc2,
      desc3,
      desc4,
      Color,
      ColorSet,
      Styles,
      image,
      image1,
      image2,
      image3,
      image4,
      videos1,
      description,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      ArmDimensions_HWD,
      SeatDimensions_HWD,
      LegHeight_CM,
      PackagingDimensions,
      Weight_KG,
      Assembly,
      NumberOfSeats,
      CaringInstructions,
      material,
      cost,
      bigCost,
      discount,
      count,
    });

    res.status(201).json({ success: true, new_todo });
  });

  static productEdit = async (req, res) => {
    const {
      categories,
      types,
      Feature,
      SubCategories,
      StockNumber,
      SpecialOffers,
      desc1,
      desc2,
      desc3,
      desc4,
      Color,
      ColorSet,
      Styles,
      image,
      image1,
      image2,
      image3,
      image4,
      videos1,
      description,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      ArmDimensions_HWD,
      SeatDimensions_HWD,
      LegHeight_CM,
      PackagingDimensions,
      Weight_KG,
      Assembly,
      NumberOfSeats,
      CaringInstructions,
      material,
      cost,
      bigCost,
      discount,
      count,
    } = req.body;
    const { id } = req.params;

    const updated = {};

    if (image) updated.image = image;
    if (image1) updated.image1 = image1;
    if (image2) updated.image2 = image2;
    if (image3) updated.image3 = image3;
    if (image4) updated.image4 = image4;

    if (discount) {
      updated.discount = discount;
      updated.discountedPrice = cost - (cost * discount) / 100;
    }

    const data = await Product.findByIdAndUpdate(
      id,
      {
        categories,
        types,
        Feature,
        SubCategories,
        StockNumber,
        SpecialOffers,
        desc1,
        desc2,
        desc3,
        desc4,
        Color,
        ColorSet,
        Styles,
        updated,
        videos1,
        description,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        ArmDimensions_HWD,
        SeatDimensions_HWD,
        LegHeight_CM,
        PackagingDimensions,
        Weight_KG,
        Assembly,
        NumberOfSeats,
        CaringInstructions,
        material,
        cost,
        bigCost,
        discount,
        count,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data });
  };

  static product_get_id = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await Product.findById(id);
    if (!data) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Todo not found!"
      );
    }

    res.status(StatusCodes.OK).json({ success: true, data });
  });

  static product_get_all = async (req, res) => {
    const { search } = req.query;
    const query = {
      $or: [],
    };
    if (search) {
      query.$or.push(
        { categories: { $regex: search, $options: "i" } },
        { types: { $regex: search, $options: "i" } }
      );
    }

    const data = await Product.find(query);

    res.status(200).json({ success: true, data });
  };

  static delet = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid ID format" });
    }

    const todo = await Product.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ success: false, msg: "Todo topilmadi" });
    }

    res.status(200).json({
      success: true,
      data: todo,
      msg: "Todo muvaffaqiyatli o'chirildi",
    });
  };

  static product_get_all_with_discount = async (req, res) => {
    const { startDate, endDate } = req.query;

    const dateFilter =
      startDate && endDate
        ? {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }
        : {};

    const data = await Product.find({ discount: { $gt: 0 }, ...dateFilter });

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Chegirma qo'llangan mahsulotlar topilmadi!",
      });
    }

    res.status(200).json({ success: true, data });
  };

  static addToCart = asyncHandler(async (req, res) => {
    let {
      user,
      fur_id,
      widthType = "",
      quantity = 1,
      selectedColors = [],
    } = req.body;
    user = req.body.USER || user;
    fur_id = req.body.FUR_ID || fur_id;

    // Find or create the cart
    const cart = await MyFurCart.findOneAndUpdate(
      { user: typeof user === "object" ? user._id : user },
      {
        $addToSet: { furniture: fur_id },
        $set: { user: typeof user === "object" ? user._id : user },
      },
      { upsert: true, new: true }
    )
      .populate([{ path: "furniture" }])
      .populate([{ path: "items.product" }]);

    if (!cart)
      return res.status(400).json({ success: false, msg: "Invalid ID format" });

    // Find the product
    const product = await Product.findById(fur_id);
    if (!product)
      return res.status(400).json({ success: false, msg: "Product not found" });

    // Determine the correct cost based on widthType
    const productCost =
      widthType === "max"
        ? parseFloat(product.bigCost)
        : parseFloat(product.cost);
    if (isNaN(productCost))
      return res
        .status(400)
        .json({ success: false, msg: "Invalid product cost" });

    // Validate selected colors
    const availableColors = product.ColorSet.flatMap((c) =>
      c.split(", ").map((c) => c.trim().toLowerCase())
    );
    const invalidColors = selectedColors
      .map((c) => c.trim().toLowerCase())
      .filter((c) => !availableColors.includes(c));
    if (invalidColors.length)
      return res.status(400).json({
        success: false,
        msg: `Invalid colors: ${invalidColors.join(", ")}`,
      });

    // Process items in the cart
    const existingItem = cart.items.find(
      (item) =>
        item.product._id.toString() === product._id.toString() &&
        item.widthType === widthType &&
        JSON.stringify(item.setColors) === JSON.stringify(selectedColors)
    );

    if (existingItem) {
      // If the item exists, increase the quantity
      existingItem.quantity += quantity;
      existingItem.totalCost = existingItem.quantity * productCost;
    } else {
      // Add a new item (if it doesn't already exist)
      cart.items.push({
        item_id: new mongoose.Types.ObjectId(), // Yangi `ObjectId` yaratish
        product: product._id,
        quantity,
        totalCost: productCost * quantity,
        setColors: selectedColors,
        widthType,
      });
    }

    // Recalculate subtotal and delivery fee
    cart.subTotalCost = cart.items.reduce(
      (total, item) => total + item.totalCost,
      0
    );
    cart.deliveryFee = 0; // Example, assuming free delivery for now

    await cart.save();

    // Clean response data to avoid unnecessary fields
    const cleanedData = {
      ...cart.toObject(),
      items: cart.items.map(
        ({ item_id, product, quantity, totalCost, setColors, widthType }) => ({
          item_id,
          product,
          quantity,
          totalCost,
          setColors,
          widthType,
        })
      ),
    };

    return res.status(existingItem ? 200 : 201).json({
      success: true,
      msg: existingItem ? "Cart updated" : "Item added to cart",
      datas: cleanedData,
    });
  });

  // static getAllCarts = asyncHandler(async (req, res) => {
  //   const { query } = req.query;

  //   const searchFilter = query
  //     ? {
  //         $or: [
  //           { full_name: { $regex: query, $options: "i" } },
  //           { categories: { $regex: query, $options: "i" } },
  //           { email: { $regex: query, $options: "i" } },
  //         ],
  //       }
  //     : {};

  //   // Savatlar sonini hisoblash
  //   const CartCount = await MyFurCart.countDocuments(searchFilter);

  //   // Kirgan foydalanuvchilarning savatlar sonini hisoblash
  //   const LoggedInCartCount = await MyFurCart.countDocuments({
  //     ...searchFilter,
  //     "user.lastLogin": { $ne: null },
  //   });

  //   if (!CartCount) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Savat topilmadi" });
  //   }

  //   // 2️⃣ Savatdagi barcha mahsulotlarni olish
  //   const cartData = await MyFurCart.find(searchFilter)
  //     .populate([
  //       {
  //         path: "furniture",
  //         select:
  //           "-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions",
  //       },
  //       { path: "user" },
  //       { path: "items" },
  //     ])
  //     .populate([{ path: "items.product" }])
  //     .sort({ sana: -1 });

  //   // 3️⃣ Savatdagi barcha mahsulotlar va kerakli malumotlarni ajratib olish
  //   const items = cartData.map((cart) => ({
  //     ...cart.toObject(),
  //     items: cart.items.map((item) => ({
  //       item_id: item._id, // 🛑 item_id ni qo'shyapmiz
  //       product: item.product,
  //       quantity: item.quantity,
  //       totalCost: item.totalCost,
  //       setColors: item.setColors,
  //       widthType: item.widthType,
  //     })),
  //   }));

  //   // 4️⃣ Natijani qaytarish
  //   res.status(200).json({
  //     success: true,
  //     CartCount,
  //     LoggedInCartCount,
  //     cartsData: items,
  //   });
  // });

  static getAllCarts = asyncHandler(async (req, res) => {
    const { query } = req.query;
  
    // Tokenni olish
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>" formatida bo'lishi kerak
  
    if (!token) {
      return res.status(401).json({ success: false, message: "Token topilmadi" });
    }
  
    // Tokenni dekodlash
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET serverning muhim konfiguratsiya parametri bo'lishi kerak
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token noto'g'ri" });
    }
  
    // Foydalanuvchining ID sini olish
    const userId = decoded.id; // Token ichida foydalanuvchi ID saqlanishi kerak
  
    const searchFilter = query
      ? {
          $or: [
            { full_name: { $regex: query, $options: "i" } },
            { categories: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};
  
    // Savatlar sonini hisoblash (umumiy)
    const CartCount = await MyFurCart.countDocuments(searchFilter);
  
    // Kirgan foydalanuvchining savatlarini hisoblash
    const LoggedInCartCount = await MyFurCart.countDocuments({
      ...searchFilter,
      user: userId, // faqat shu foydalanuvchining savatlarini hisoblash
    });
  
    if (!CartCount) {
      return res
        .status(404)
        .json({ success: false, message: "Savat topilmadi" });
    }
  
    // 2️⃣ Savatdagi barcha mahsulotlarni olish (faqat shu foydalanuvchi uchun)
    const cartData = await MyFurCart.find({
      ...searchFilter,
      user: userId, // faqat shu foydalanuvchining savatlarini olish
    })
      .populate([
        {
          path: "furniture",
          select:
            "-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions",
        },
        { path: "user" },
        { path: "items" },
      ])
      .populate([{ path: "items.product" }])
      .sort({ sana: -1 });
  
    // 3️⃣ Savatdagi barcha mahsulotlar va kerakli malumotlarni ajratib olish
    const items = cartData.map((cart) => ({
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        item_id: item._id, // 🛑 item_id ni qo'shyapmiz
        product: item.product,
        quantity: item.quantity,
        totalCost: item.totalCost,
        setColors: item.setColors,
        widthType: item.widthType,
      })),
    }));
  
    // 4️⃣ Natijani qaytarish
    res.status(200).json({
      success: true,
      CartCount,
      LoggedInCartCount,
      cartsData: items,
    });
  });
  
  static getCartDatails = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    try {
      if (!userId) { return res.status(400).json({ success: false, msg: "Invalid ID format" }); }
      const cart = await MyFurCart.findOne({ user: userId }).populate("items.product");
      if (!cart) { return res.status(StatusCodes.NOT_FOUND).json({ success: false, msg: "Cart not found" }); }
      res.status(StatusCodes.OK).json({ success: true, data: cart, users: cart.user });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  });

  static deletCart = async (req, res) => {
    const { furId } = req.body;

    if (!furId || !mongoose.Types.ObjectId.isValid(furId)) {
      return res.status(400).json({ success: false, msg: "Invalid ID format" });
    }

    const updatedCart = await MyFurCart.findOneAndUpdate(
      { "items._id": furId },
      { $pull: { items: { _id: furId } } },
      { new: true }
    );

    if (!updatedCart)
      return res.status(404).json({ success: false, msg: "Item not found" });

    // Furnitureni tekshirib yangilash
    await Promise.all(
      updatedCart.furniture.map(async (furnId) => {
        if (
          !updatedCart.items.some(
            (item) => item.product.toString() === furnId.toString()
          )
        ) {
          await MyFurCart.findOneAndUpdate(
            { _id: updatedCart._id },
            { $pull: { furniture: furnId } },
            { new: true }
          );
        }
      })
    );

    // Agar cart bo‘sh bo‘lsa, o‘chirish
    if (
      (await MyFurCart.findById(updatedCart._id))?.furniture.length === 0 &&
      updatedCart.items.length === 0
    ) {
      await MyFurCart.findByIdAndDelete(updatedCart._id);
    }

    res.status(200).json({
      success: true,
      data: updatedCart,
      msg: "Item successfully deleted",
    });
  };

  static updateCartItem = asyncHandler(async (req, res) => {
    const { fur_id, item_id, quantity } = req.body;

    // 1️⃣ ID larni tekshiramiz
    if (!fur_id || !item_id || !quantity) {
      return res.status(400).json({ success: false, msg: "ID not found" });
    }

    // 2️⃣ Cart ni topamiz
    const cart = await MyFurCart.findOne({ furniture: fur_id }).populate(
      "items.product"
    );
    if (!cart) {
      return res.status(400).json({ success: false, msg: "Cart not found" });
    }

    // 3️⃣ Item ni topamiz
    const existingItem = cart.items.find(
      (item) => item._id.toString() === item_id.toString()
    );
    if (!existingItem) {
      return res.status(400).json({ success: false, msg: "Item not found" });
    }

    // 4️⃣ Mahsulot narxini olish
    const product = await Product.findById(fur_id).select(
      "widthType bigCost cost"
    );
    if (!product) {
      return res.status(400).json({ success: false, msg: "Product not found" });
    }
    let productCost = 0;
    if (existingItem.widthType === "max") {
      productCost = parseFloat(product.bigCost) || 0;
    } else if (existingItem.widthType === "min") {
      productCost = parseFloat(product.cost) || 0;
    }
    if (productCost <= 0) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid product cost" });
    }

    // 5️⃣ Narxni yangilash
    existingItem.quantity = quantity;
    existingItem.totalCost = quantity * productCost;
    // 🔹 subTotalCost yangilash
    cart.subTotalCost = cart.items.reduce(
      (total, item) => total + item.totalCost,
      0
    );

    // 6️⃣ Umumiy narxni hisoblash
    cart.totalCost = cart.subTotalCost; // Agar boshqa qo‘shimcha narxlar bo‘lsa, ularni ham qo‘shish kerak
    console.log("Umumiy narx:", cart.totalCost);
    console.log("SubTotalCost:", cart.subTotalCost);

    await cart.save();

    return res
      .status(200)
      .json({ success: true, msg: "Cart updated", datas: cart });
  });

  static viewCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userCart = await MyFurCart.findOne({ user: userId })
      .populate("items.product")
      .populate("furniture");

    if (!userCart) {
      return res
        .status(404)
        .json({ success: false, message: "User cart not found es" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      cart: userCart,
    });
  });
}
