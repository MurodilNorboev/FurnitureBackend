import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import mongoose from "mongoose";
import { Product } from "../../models/Admin/product.model.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";
import moment from "moment";

// export class Products {
//   static productsall = asyncHandler(async (req, res) => {
//     const {
//       categories,
//       types,
//       Feature,
//       desc1,
//       desc2,
//       desc3,
//       desc4,
//       Color,
//       Styles,
//       image,
//       isname,
//       image1,
//       image2,
//       image3,
//       videos1,
//       description,
//       Height,
//       Width,
//       ArmDimensions_HWD,
//       SeatDimensions_HWD,
//       LegHeight_CM,
//       PackagingDimensions,
//       Weight_KG,
//       Assembly,
//       NumberOfSeats,
//       CaringInstructions,
//       material,
//       cost,
//       discount,
//       count,
//     } = req.body;

//     const new_todo = await Product.create({
//       categories,
//       types,
//       Feature,
//       desc1,
//       desc2,
//       desc3,
//       desc4,
//       Color,
//       Styles,
//       image,
//       isname,
//       image1,
//       image2,
//       image3,
//       videos1,
//       description,
//       Height,
//       Width,
//       ArmDimensions_HWD,
//       SeatDimensions_HWD,
//       LegHeight_CM,
//       PackagingDimensions,
//       Weight_KG,
//       Assembly,
//       NumberOfSeats,
//       CaringInstructions,
//       material,
//       cost,
//       discount,
//       count,
//     });

//     res.status(201).json({ success: true, new_todo });
//   });

//   static productEdit = async (req, res) => {
//     const {
//       cost,
//       chair,
//       Assemblys,
//       Material,
//       customerReviews,
//       description,
//       CaringInstructions,
//       NumberOfSeats,
//       Assembly,
//       Weight_KG,
//       PackagingDimensions,
//       LegHeight_CM,
//       SeatDimensions_HWD,
//       ArmDemensions_HWD,
//       Width,
//       Hight,
//       desc1,
//       desc2,
//       desc3,
//       desc4,
//       desc5,
//       desc6,
//       desc7,
//       desc8,
//       videos1,
//       image,
//       image1,
//       image2,
//       image3,
//       image4,
//       image5,
//       image6,
//       image7,
//       isname,
//       label,
//       Feature,
//       Styles,
//       Color,
//       material,
//       Hot,
//       HotNum,
//       issNew,
//       Popular,
//       types,
//       categories,
//       discount,
//     } = req.body;
//     const { id } = req.params;

//     const updated = {};

//     if (image) updated.image = image;
//     if (image1) updated.image1 = image1;
//     if (image2) updated.image2 = image2;
//     if (image3) updated.image3 = image3;
//     if (image4) updated.image4 = image4;
//     if (image5) updated.image5 = image5;
//     if (image6) updated.image6 = image6;
//     if (image7) updated.image7 = image7;

//     if (discount) {
//       updated.discount = discount;
//       updated.discountedPrice = cost - (cost * discount) / 100;
//     }

//     const data = await Product.findByIdAndUpdate(
//       id,
//       {

// },
//       { new: true }
//     );

//     res.status(200).json({ success: true, data });
//   };

//   static product_get_id = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const data = await Product.findById(id);
//     if (!data) {
//       throw new HttpException(
//         StatusCodes.NOT_FOUND,
//         ReasonPhrases.NOT_FOUND,
//         "Todo not found!"
//       );
//     }

//     res.status(StatusCodes.OK).json({ success: true, data });
//   });

//   static product_get_all = async (req, res) => {
//     const { search } = req.query;
//     const query = {
//       $or: [],
//     };
//     if (search) {
//       query.$or.push(
//         { categories: { $regex: search, $options: "i" } },
//         { types: { $regex: search, $options: "i" } }
//       );
//     }

//     const data = await Product.find(query);

//     res.status(200).json({ success: true, data });
//   };

//   static delet = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, msg: "Invalid ID format" });
//     }

//     const todo = await Product.findByIdAndDelete(id);

//     if (!todo) {
//       return res.status(404).json({ success: false, msg: "Todo topilmadi" });
//     }

//     res.status(200).json({
//       success: true,
//       data: todo,
//       msg: "Todo muvaffaqiyatli o'chirildi",
//     });
//   };

//   static product_get_all_with_discount = async (req, res) => {
//     const { startDate, endDate } = req.query;

//     const dateFilter =
//       startDate && endDate
//         ? {
//             createdAt: {
//               $gte: new Date(startDate),
//               $lte: new Date(endDate),
//             },
//           }
//         : {};

//     const data = await Product.find({ discount: { $gt: 0 }, ...dateFilter });

//     if (!data || data.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: "Chegirma qo'llangan mahsulotlar topilmadi!",
//       });
//     }

//     res.status(200).json({ success: true, data });
//   };

  // static addToCart = asyncHandler(async (req, res) => {
  //   const { user, fur_id } = req.body;

  //   const datas = await MyFurCart.findOneAndUpdate(
  //     { user: user._id },
  //     { $addToSet: { furniture: fur_id }, $set: { user: user._id } },
  //     { upsert: true }
  //   );
  //   if (!datas) {
  //     return res
  //       .status(StatusCodes.BAD_REQUEST)
  //       .json({ success: false, msg: "Invalid ID format" });
  //   }

  //   res.status(201).json({ success: true, datas });
  // });

//   static getCart = asyncHandler(async (req, res) => {
//     const { user } = req.body;
//     const { query } = req.query;

//     const searchFilter = query
//       ? {
//           $or: [
//             { "user.full_name": { $regex: query, $options: "i" } },
//             { "user.lastName": { $regex: query, $options: "i" } },
//           ],
//         }
//       : {};

//     const totalCarts = await MyFurCart.countDocuments(searchFilter);

//     const my_carts = await MyFurCart.findOne({ user: user._id }).populate([
//       { path: "furniture" },
//       { path: "user" },
//     ]);

//     res.status(201).json({ success: true, my_carts, usersData, totalCarts });
//   });

//   static getAllCarts = asyncHandler(async (req, res) => {
//     const { query } = req.query;

//     const searchFilter = query
//       ? {
//           $or: [
//             { full_name: { $regex: query, $options: "i" } },
//             { categories: { $regex: query, $options: "i" } },
//             { email: { $regex: query, $options: "i" } },
//           ],
//         }
//       : {};

//     const CartCount = await MyFurCart.countDocuments(searchFilter);

//     const LoggedInCartCount = await MyFurCart.countDocuments({
//       ...searchFilter,
//       "user.lastLogin": { $ne: null },
//     });

//     const cartsData = await MyFurCart.find(searchFilter)
//       .populate([{ path: "furniture" }, { path: "user" }])
//       .sort({ sana: -1 });

//     // Furniture asosida oxirgi 30 kunni hisoblash
//     const last30DaysData = Array.from({ length: 30 }, (_, index) => {
//       const date = moment().subtract(index, "day").format("YYYY-MM-DD");
//       const count = cartsData.reduce((acc, cart) => {
//         // Furniture ichidagi har bir elementni tekshirish
//         const furnitureCount = cart.furniture.filter(
//           (furniture) => moment(cart.sana).format("YYYY-MM-DD") === date
//         ).length;
//         return acc + furnitureCount;
//       }, 0);
//       return { date, count };
//     }).reverse();

//     res.status(200).json({
//       success: true,
//       CartCount,
//       LoggedInCartCount,
//       cartsData,
//       last30DaysData,
//     });
//   });

// static cartDelet = asyncHandler(async (req, res) => {
//   const { cartId, furnitureId } = req.params;

//   // Savatni ID bo'yicha toping
//   const cart = await MyFurCart.findById(cartId);
//   if (!cart) {
//     return res.status(404).json({ success: false, msg: "Cart topilmadi" });
//   }

//   // `items` ichidagi mahsulotni o'chirish
//   const itemIndex = cart.items.findIndex(
//     (item) => item.product.toString() === furnitureId
//   );
//   if (itemIndex !== -1) {
//     cart.items.splice(itemIndex, 1);
//   }

//   // `furniture` ichidagi mahsulotni o'chirish
//   const furnitureIndex = cart.furniture.findIndex(
//     (item) => item._id.toString() === furnitureId
//   );
//   if (furnitureIndex !== -1) {
//     cart.furniture.splice(furnitureIndex, 1);
//   }

//   // Agar mahsulotlar topilmasa, xabar qaytariladi
//   if (itemIndex === -1 && furnitureIndex === -1) {
//     return res
//       .status(404)
//       .json({ success: false, msg: "Mahsulot cartda topilmadi" });
//   }

//   // Umumiy narxni qayta hisoblash
//   cart.totalCost = cart.items.reduce(
//     (total, item) => total + item.totalCost,
//     0
//   );

//   const updatedCart = await cart.save();

//   res.status(200).json({
//     success: true,
//     cart: updatedCart,
//     msg: "Mahsulot muvaffaqiyatli cartdan o'chirildi",
//   });
// });

//   static checkout = asyncHandler(async (req, res) => {
//     const { furnitureId, quantity, userId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid furniture ID" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     const userCart = await MyFurCart.findOne({ user: userId });

//     if (!userCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User cart not found" });
//     }

//     const product = await Product.findById(furnitureId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     const productCost = parseFloat(product.cost.replace("$", "").trim());
//     if (isNaN(productCost)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid product cost" });
//     }

//     const existingProduct = userCart.items.find(
//       (item) => item.product.toString() === product._id.toString()
//     );

//     if (existingProduct) {
//       existingProduct.quantity = quantity;
//       existingProduct.totalCost = existingProduct.quantity * productCost;
//     } else {
//       userCart.items.push({
//         product: product._id,
//         quantity,
//         totalCost: productCost * quantity,
//       });
//     }

//     userCart.totalCost = userCart.items.reduce(
//       (total, item) => total + item.totalCost,
//       0
//     );

//     const updatedCart = await userCart.save();

//     res.status(200).json({
//       success: true,
//       cart: updatedCart,
//     });
//   });

//   static viewCart = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const userCart = await MyFurCart.findOne({ user: userId }).populate(
//       "items.product"
//     );

//     if (!userCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User cart not found es" });
//     }

//     res.status(StatusCodes.OK).json({
//       success: true,
//       cart: userCart,
//     });
//   });
// }

// export class Products {
//   static productsall = asyncHandler(async (req, res) => {
//     const {
//       categories,
//       types,
//       Feature,
//       SubCategories,
//       StockNumber,
//       SpecialOffers,
//       desc1,
//       desc2,
//       desc3,
//       desc4,
//       Color,
//       ColorSet,
//       Styles,
//       image,
//       image1,
//       image2,
//       image3,
//       image4,
//       videos1,
//       description,
//       minWidth,
//       maxWidth,
//       minHeight,
//       maxHeight,
//       ArmDimensions_HWD,
//       SeatDimensions_HWD,
//       LegHeight_CM,
//       PackagingDimensions,
//       Weight_KG,
//       Assembly,
//       NumberOfSeats,
//       CaringInstructions,
//       material,
//       cost,
//       bigCost,
//       discount,
//       count,
//     } = req.body;

//     const new_todo = await Product.create({
//       categories,
//       types,
//       Feature,
//       SubCategories,
//       StockNumber,
//       SpecialOffers,
//       desc1,
//       desc2,
//       desc3,
//       desc4,
//       Color,
//       ColorSet,
//       Styles,
//       image,
//       image1,
//       image2,
//       image3,
//       image4,
//       videos1,
//       description,
//       minWidth,
//       maxWidth,
//       minHeight,
//       maxHeight,
//       ArmDimensions_HWD,
//       SeatDimensions_HWD,
//       LegHeight_CM,
//       PackagingDimensions,
//       Weight_KG,
//       Assembly,
//       NumberOfSeats,
//       CaringInstructions,
//       material,
//       cost,
//       bigCost,
//       discount,
//       count,
//     });

//     res.status(201).json({ success: true, new_todo });
//   });

//   static productEdit = async (req, res) => {
//     const {
//       categories,
//       types,
//       Feature,
//       SubCategories,
//       StockNumber,
//       SpecialOffers,
//       desc1,
//       desc2,
//       desc3,
//       desc4,
//       Color,
//       ColorSet,
//       Styles,
//       image,
//       image1,
//       image2,
//       image3,
//       image4,
//       videos1,
//       description,
//       minWidth,
//       maxWidth,
//       minHeight,
//       maxHeight,
//       ArmDimensions_HWD,
//       SeatDimensions_HWD,
//       LegHeight_CM,
//       PackagingDimensions,
//       Weight_KG,
//       Assembly,
//       NumberOfSeats,
//       CaringInstructions,
//       material,
//       cost,
//       bigCost,
//       discount,
//       count,
//     } = req.body;
//     const { id } = req.params;

//     const updated = {};

//     if (image) updated.image = image;
//     if (image1) updated.image1 = image1;
//     if (image2) updated.image2 = image2;
//     if (image3) updated.image3 = image3;
//     if (image4) updated.image4 = image4;

//     if (discount) {
//       updated.discount = discount;
//       updated.discountedPrice = cost - (cost * discount) / 100;
//     }

//     const data = await Product.findByIdAndUpdate(
//       id,
//       {
//         categories,
//         types,
//         Feature,
//         SubCategories,
//         StockNumber,
//         SpecialOffers,
//         desc1,
//         desc2,
//         desc3,
//         desc4,
//         Color,
//         ColorSet,
//         Styles,
//         updated,
//         videos1,
//         description,
//         minWidth,
//         maxWidth,
//         minHeight,
//         maxHeight,
//         ArmDimensions_HWD,
//         SeatDimensions_HWD,
//         LegHeight_CM,
//         PackagingDimensions,
//         Weight_KG,
//         Assembly,
//         NumberOfSeats,
//         CaringInstructions,
//         material,
//         cost,
//         bigCost,
//         discount,
//         count,
//       },
//       { new: true }
//     );

//     res.status(200).json({ success: true, data });
//   };

//   static product_get_id = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const data = await Product.findById(id);
//     if (!data) {
//       throw new HttpException(
//         StatusCodes.NOT_FOUND,
//         ReasonPhrases.NOT_FOUND,
//         "Todo not found!"
//       );
//     }

//     res.status(StatusCodes.OK).json({ success: true, data });
//   });

//   static product_get_all = async (req, res) => {
//     const { search } = req.query;
//     const query = {
//       $or: [],
//     };
//     if (search) {
//       query.$or.push(
//         { categories: { $regex: search, $options: "i" } },
//         { types: { $regex: search, $options: "i" } }
//       );
//     }

//     const data = await Product.find(query);

//     res.status(200).json({ success: true, data });
//   };

//   static delet = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, msg: "Invalid ID format" });
//     }

//     const todo = await Product.findByIdAndDelete(id);

//     if (!todo) {
//       return res.status(404).json({ success: false, msg: "Todo topilmadi" });
//     }

//     res.status(200).json({
//       success: true,
//       data: todo,
//       msg: "Todo muvaffaqiyatli o'chirildi",
//     });
//   };

//   static product_get_all_with_discount = async (req, res) => {
//     const { startDate, endDate } = req.query;

//     const dateFilter =
//       startDate && endDate
//         ? {
//             createdAt: {
//               $gte: new Date(startDate),
//               $lte: new Date(endDate),
//             },
//           }
//         : {};

//     const data = await Product.find({ discount: { $gt: 0 }, ...dateFilter });

//     if (!data || data.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: "Chegirma qo'llangan mahsulotlar topilmadi!",
//       });
//     }

//     res.status(200).json({ success: true, data });
//   };

//   static addToCart1 = asyncHandler(async (req, res) => {
//     const { user, fur_id } = req.body;

//     const datas = await MyFurCart.findOneAndUpdate(
//       { user: user._id },
//       { $addToSet: { furniture: fur_id }, $set: { user: user._id } },
//       { upsert: true }
//     ).populate([{ path: "furniture" }]);
//     if (!datas) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, msg: "Invalid ID format" });
//     }

//     res.status(201).json({ success: true, datas });
//   });

//   static addToCart3 = asyncHandler(async (req, res) => {
//     let { user, fur_id } = req.body;
//     let {
//       USER,
//       FUR_ID,
//       widthType = "min",
//       quantity = 1,
//       selectedColors = [],
//     } = req.body;

//     // Agar USER va FUR_ID mavjud bo'lsa, ularni ishlatamiz
//     user = USER || user;
//     fur_id = FUR_ID || fur_id;

//     // 1️⃣ Savatga qo'shish yoki yangilash
//     const datas = await MyFurCart.findOneAndUpdate(
//       { user: typeof user === "object" ? user._id : user },
//       {
//         $addToSet: { furniture: fur_id },
//         $set: { user: typeof user === "object" ? user._id : user },
//       },
//       { upsert: true, new: true }
//     ).populate([{ path: "furniture" }]);

//     if (!datas) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, msg: "Invalid ID format" });
//     }

//     // 2️⃣ Mahsulotni topish
//     const product = await Product.findOne({ _id: fur_id });
//     if (!product) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, msg: "Mahsulot topilmadi" });
//     }

//     // 3️⃣ Narxni hisoblash (widthType ga qarab)
//     let productCost =
//       widthType === "max"
//         ? parseFloat(product.bigCost)
//         : parseFloat(product.cost);

//     if (isNaN(productCost)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid product cost" });
//     }

//     // 4️⃣ Tanlangan ranglarni tekshirish
//     // 4. Tanlangan ranglarni tekshirish
//     let availableColors = product.ColorSet;
//     if (Array.isArray(availableColors)) {
//       availableColors = availableColors.join(", ");
//     }
//     const invalidColors = selectedColors.filter(
//       (color) => !availableColors.includes(color)
//     );
//     if (invalidColors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Bunday ranglar mavjud emas: ${invalidColors.join(", ")}`,
//       });
//     }

//     // 5️⃣ Savatni aniqlash va mahsulotni qo‘shish
//     let furniture = datas; // Savatni `datas` dan olish

//     const existingItem = furniture.items.find(
//       (item) =>
//         item.product &&
//         item.product._id.toString() === product._id.toString() &&
//         (item.selectedColors || []).every((color) =>
//           selectedColors.includes(color)
//         )
//     );

//     if (existingItem) {
//       existingItem.quantity = quantity;
//       existingItem.totalCost = quantity * productCost;
//     } else {
//       furniture.items.unshift({
//         product: product._id,
//         quantity,
//         totalCost: productCost * quantity,
//         selectedColors, // Tanlangan ranglarni qo‘shish
//       });
//     }

//     res.status(201).json({ success: true, datas });
//   });

  // static addToCart = asyncHandler(async (req, res) => {
  //   let { user, fur_id } = req.body;
  //   let {
  //     USER,
  //     FUR_ID,
  //     widthType = "min", // ✅ O‘lchamni tanlash
  //     quantity = 1,
  //     selectedColors = [],
  //   } = req.body;

  //   // Agar USER va FUR_ID mavjud bo'lsa, ularni ishlatamiz
  //   user = USER || user;
  //   fur_id = FUR_ID || fur_id;

  //   // 1️⃣ Savatga qo'shish yoki yangilash
  //   const datas = await MyFurCart.findOneAndUpdate(
  //     { user: typeof user === "object" ? user._id : user },
  //     {
  //       $addToSet: { furniture: fur_id },
  //       $set: { user: typeof user === "object" ? user._id : user },
  //     },
  //     { upsert: true, new: true }
  //   ).populate([{ path: "furniture" }]);

  //   if (!datas) {
  //     return res
  //       .status(StatusCodes.BAD_REQUEST)
  //       .json({ success: false, msg: "Invalid ID format" });
  //   }

  //   // 2️⃣ Mahsulotni topish
  //   const product = await Product.findOne({ _id: fur_id });
  //   if (!product) {
  //     return res
  //       .status(StatusCodes.BAD_REQUEST)
  //       .json({ success: false, msg: "Mahsulot topilmadi" });
  //   }

  //   // 3️⃣ Narxni hisoblash (widthType ga qarab)
  //   let productCost =
  //     widthType === "max"
  //       ? parseFloat(product.bigCost)
  //       : parseFloat(product.cost);

  //   if (isNaN(productCost)) {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: "Invalid product cost" });
  //   }

  //   // 4️⃣ Tanlangan ranglarni tekshirish
  //   console.log("Tanlangan ranglar:", selectedColors);

  //   let availableColors = Array.isArray(product.ColorSet)
  //     ? product.ColorSet.flatMap((color) =>
  //         color.split(", ").map((c) => c.trim())
  //       )
  //     : [];

  //   console.log("Mavjud ranglar:", availableColors);

  //   const invalidColors = selectedColors.filter(
  //     (color) =>
  //       !availableColors
  //         .map((c) => c.toLowerCase())
  //         .includes(color.toLowerCase())
  //   );

  //   console.log("Noto‘g‘ri ranglar:", invalidColors.join(", "));

  //   if (invalidColors.length > 0) {
  //     return res.status(400).json({
  //       success: false,
  //       message: `Bunday ranglar mavjud emas: ${invalidColors.join(", ")}`,
  //     });
  //   }

  //   // 5️⃣ Savatni aniqlash va mahsulotni qo‘shish
  //   let furniture = datas; // Savatni `datas` dan olish

  //   const existingItem = furniture.items.find(
  //     (item) =>
  //       item.product &&
  //       item.product._id.toString() === product._id.toString() &&
  //       item.widthType === widthType && // ✅ O‘lcham ham tekshiriladi
  //       (item.selectedColors || []).every((color) =>
  //         selectedColors.includes(color)
  //       )
  //   );

  //   if (existingItem) {
  //     // Agar mavjud bo'lsa, yangilash
  //     existingItem.quantity = quantity;
  //     existingItem.totalCost = quantity * productCost;
  //     existingItem.selectedColors = selectedColors;
  //     existingItem.widthType = widthType; // ✅ O‘lchamni yangilash
  //     console.log("Updated existing item:", existingItem);
  //   } else {
  //     // Yangi mahsulot qo'shish
  //     furniture.items.unshift({
  //       product: product._id,
  //       quantity,
  //       totalCost: productCost * quantity,
  //       selectedColors: selectedColors,
  //       widthType: widthType, // ✅ O‘lchamni saqlash
  //     });

  //     console.log("New item added:", furniture.items[0]);
  //   }

  //   res.status(201).json({
  //     success: true,
  //     datas: {
  //       ...datas.toObject(),
  //       items: datas.items.map((item) => ({
  //         product: item.product,
  //         quantity: item.quantity,
  //         totalCost: item.totalCost,
  //         selectedColors,
  //         widthType, // ✅ JSON javobda ham qo‘shamiz
  //       })),
  //     },
  //   });
  // });

//   static addToCart2 = asyncHandler(async (req, res) => {
//     const {
//       user,
//       fur_id,
//       widthType = "min", // Agar widthType bo'lmasa, "min"ni qo'llaymiz
//       quantity = 1, // Agar miqdor bo'lmasa, 1ni qo'llaymiz
//       selectedColors = [],
//     } = req.body;

//     const userId = user._id || user;
//     try {
//       // Foydalanuvchining savatini topish va populate qilish
//       let furniture = await MyFurCart.findOne({
//         user: userId,
//       }).populate({
//         path: "items.product", // productni populate qilish
//         select: `-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions`,
//       });

//       if (!furniture) {
//         console.log("Yangi savat yaratish...");
//         // Agar savat mavjud bo'lmasa, yangi savat yaratish
//         furniture = new MyFurCart({
//           user: userId,
//           items: [],
//         });
//       } else {
//         console.log("Mavjud savat topildi...");
//       }

//       // 2. Mahsulotni topish
//       const product = await Product.findOne({ _id: fur_id });
//       if (!product) {
//         return res
//           .status(StatusCodes.BAD_REQUEST)
//           .json({ success: false, msg: "Mahsulot topilmadi" });
//       }

//       // 3. Narxni hisoblash (widthType ga qarab)
//       let productCost = 0;
//       if (widthType === "min") {
//         productCost = parseFloat(product.cost);
//       } else if (widthType === "max") {
//         productCost = parseFloat(product.bigCost);
//       }
//       if (isNaN(productCost)) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid product cost" });
//       }

//       // 4. Tanlangan ranglarni tekshirish
//       let availableColors = product.ColorSet;
//       if (Array.isArray(availableColors)) {
//         availableColors = availableColors.join(", ");
//       }
//       const invalidColors = selectedColors.filter(
//         (color) => !availableColors.includes(color)
//       );
//       if (invalidColors.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: `Bunday ranglar mavjud emas: ${invalidColors.join(", ")}`,
//         });
//       }

//       // 5. Savatga mahsulot qo'shish yoki yangilash
//       const existingItem = furniture.items.find((item) => {
//         return (
//           item.product &&
//           item.product._id.toString() === product._id.toString() &&
//           (item.selectedColors || []).every((color) =>
//             selectedColors.includes(color)
//           )
//         );
//       });

//       if (existingItem) {
//         existingItem.quantity = quantity;
//         existingItem.totalCost = quantity * productCost;
//       } else {
//         furniture.items.unshift({
//           product: product._id,
//           quantity,
//           totalCost: productCost * quantity,
//           selectedColors, // Tanlangan ranglarni qo'shish
//         });
//       }

//       // "furniture" maydonini olib tashlash
//       const { furniture: removedFurniture, ...furnitureData } =
//         furniture.toObject();

//       // ozgarishlarni saqlash va yuklash
//       await furniture.save();

//       res.status(200).json({
//         success: true,
//         furniture: {
//           ...furnitureData,
//           items: furnitureData.items.map((item) => ({
//             ...item,
//             selectedColors: item.selectedColors || selectedColors, // selectedColors ni ham qaytarish
//           })),
//         },
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, message: "nomalum hatolik " });
//     }
//   });

//   static getAllCarts1 = asyncHandler(async (req, res) => {
//     const { query } = req.query;

//     const searchFilter = query
//       ? {
//           $or: [
//             { full_name: { $regex: query, $options: "i" } },
//             { categories: { $regex: query, $options: "i" } },
//             { email: { $regex: query, $options: "i" } },
//           ],
//         }
//       : {};

//     const CartCount = await MyFurCart.countDocuments(searchFilter);
//     const LoggedInCartCount = await MyFurCart.countDocuments({
//       ...searchFilter,
//       "user.lastLogin": { $ne: null },
//     });

//     const cartsData = await MyFurCart.find(searchFilter)
//       .populate([
//         {
//           path: "furniture",
//           select:
//             "-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions",
//         },
//         { path: "user" },
//         { path: "items" },
//       ])
//       .sort({ sana: -1 });

//     // Furniture asosida oxirgi 30 kunni hisoblash
//     const last30DaysData = Array.from({ length: 30 }, (_, index) => {
//       const date = moment().subtract(index, "day").format("YYYY-MM-DD");
//       const count = cartsData.reduce((acc, cart) => {
//         // Furniture ichidagi har bir elementni tekshirish
//         const furnitureCount = cart.furniture.filter(
//           (furniture) => moment(cart.sana).format("YYYY-MM-DD") === date
//         ).length;
//         return acc + furnitureCount;
//       }, 0);
//       return { date, count };
//     }).reverse();

//     res.status(200).json({
//       success: true,
//       CartCount,
//       LoggedInCartCount,
//       cartsData,
//       last30DaysData,
//     });
//   });

//   static getAllCarts = asyncHandler(async (req, res) => {
//     const { query } = req.query;

//     const searchFilter = query
//       ? {
//           $or: [
//             { full_name: { $regex: query, $options: "i" } },
//             { categories: { $regex: query, $options: "i" } },
//             { email: { $regex: query, $options: "i" } },
//           ],
//         }
//       : {};

//     const CartCount = await MyFurCart.countDocuments(searchFilter);
//     const LoggedInCartCount = await MyFurCart.countDocuments({
//       ...searchFilter,
//       "user.lastLogin": { $ne: null },
//     });

//     const cartsData = await MyFurCart.find(searchFilter)
//       .populate([
//         {
//           path: "furniture",
//           select:
//             "-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions",
//         },
//         { path: "user" },
//         { path: "items" },
//       ])
//       .sort({ sana: -1 });

//     // Furniture asosida oxirgi 30 kunni hisoblash
//     const last30DaysData = Array.from({ length: 30 }, (_, index) => {
//       const date = moment().subtract(index, "day").format("YYYY-MM-DD");
//       const count = cartsData.reduce((acc, cart) => {
//         // Furniture ichidagi har bir elementni tekshirish
//         const furnitureCount = cart.furniture.filter(
//           (furniture) => moment(cart.sana).format("YYYY-MM-DD") === date
//         ).length;
//         return acc + furnitureCount;
//       }, 0);
//       return { date, count };
//     }).reverse();

//     // **`items` obyektiga `selectedColors` qo‘shish**
//     const updatedCartsData = cartsData.map((cart) => ({
//       ...cart.toObject(),
//       items: cart.items.map((item) => {
//         // Mahsulotni `furniture` ichidan topish
//         const productData = cart.furniture.find(
//           (furniture) => furniture._id.toString() === item.product.toString()
//         );

//         return {
//           product: item.product,
//           quantity: item.quantity,
//           totalCost: item.totalCost,
//           selectedColors: productData ? productData.ColorSet : [], // ✅ Agar product bo'lsa, ColorSet olib beriladi
//         };
//       }),
//     }));

//     console.log(
//       updatedCartsData.flatMap((cart) =>
//         cart.items.map((item) => item.selectedColors)
//       )
//     );

//     res.status(200).json({
//       success: true,
//       CartCount,
//       LoggedInCartCount,
//       cartsData: updatedCartsData,
//       last30DaysData,
//     });
//   });

//   static cartDelet = asyncHandler(async (req, res) => {
//     const { cartId, furnitureId } = req.params;

//     // Savatni ID bo'yicha toping
//     const cart = await MyFurCart.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ success: false, msg: "Cart topilmadi" });
//     }

//     // `items` ichidagi mahsulotni o'chirish
//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === furnitureId
//     );
//     if (itemIndex !== -1) {
//       cart.items.splice(itemIndex, 1);
//     }

//     // `furniture` ichidagi mahsulotni o'chirish
//     const furnitureIndex = cart.furniture.findIndex(
//       (item) => item._id.toString() === furnitureId
//     );
//     if (furnitureIndex !== -1) {
//       cart.furniture.splice(furnitureIndex, 1);
//     }

//     // Agar mahsulotlar topilmasa, xabar qaytariladi
//     if (itemIndex === -1 && furnitureIndex === -1) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "Mahsulot cartda topilmadi" });
//     }

//     // Umumiy narxni qayta hisoblash
//     cart.totalCost = cart.items.reduce(
//       (total, item) => total + item.totalCost,
//       0
//     );

//     const updatedCart = await cart.save();

//     res.status(200).json({
//       success: true,
//       cart: updatedCart,
//       msg: "Mahsulot muvaffaqiyatli cartdan o'chirildi",
//     });
//   });

//   static checkout1 = asyncHandler(async (req, res) => {
//     const { furnitureId, quantity, userId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid furniture ID" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     const userCart = await MyFurCart.findOne({ user: userId });

//     if (!userCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User cart not found" });
//     }

//     const product = await Product.findById(furnitureId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     const productCost = parseFloat(product.cost);
//     if (isNaN(productCost)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid product cost" });
//     }

//     const existingProduct = userCart.items.find(
//       (item) => item.product.toString() === product._id.toString()
//     );

//     if (existingProduct) {
//       existingProduct.quantity = quantity;
//       existingProduct.totalCost = existingProduct.quantity * productCost;
//     } else {
//       userCart.items.push({
//         product: product._id,
//         quantity,
//         totalCost: productCost * quantity,
//       });
//     }

//     userCart.totalCost = userCart.items.reduce(
//       (total, item) => total + item.totalCost,
//       0
//     );

//     const updatedCart = await userCart.save();

//     res.status(200).json({
//       success: true,
//       cart: updatedCart,
//     });
//   });

//   static viewCart1 = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const userCart = await MyFurCart.findOne({ user: userId }).populate(
//       "items.product"
//     );

//     if (!userCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User cart not found es" });
//     }

//     res.status(StatusCodes.OK).json({
//       success: true,
//       cart: userCart,
//     });
//   });

//   static checkout = asyncHandler(async (req, res) => {
//     const { furnitureId, quantity, userId, widthType } = req.body;

//     // Validate the furniture ID and user ID
//     if (
//       !mongoose.Types.ObjectId.isValid(furnitureId) ||
//       !mongoose.Types.ObjectId.isValid(userId)
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid furniture or user ID" });
//     }

//     // Find the user's cart
//     let userCart = await MyFurCart.findOne({
//       user: userId,
//     });

//     if (!userCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User cart not found" });
//     }

//     // Find the product
//     const product = await Product.findById(furnitureId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     // Determine the product cost based on the widthType (min or max)
//     let productCost =
//       widthType === "max"
//         ? parseFloat(product.bigCost)
//         : parseFloat(product.cost);

//     if (isNaN(productCost)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid product cost" });
//     }

//     // Find the existing product in the user's cart
//     const existingProduct = userCart.items.find(
//       (item) => item.product.toString() === product._id.toString()
//     );

//     if (existingProduct) {
//       // Update the quantity and total cost
//       existingProduct.quantity = quantity;
//       existingProduct.totalCost = existingProduct.quantity * productCost;
//     } else {
//       // Add the new product with the selected quantity
//       userCart.items.push({
//         product: product._id,
//         quantity,
//         totalCost: productCost * quantity,
//       });
//     }

//     // Recalculate the total cost for the entire cart
//     userCart.totalCost = userCart.items.reduce(
//       (total, item) => total + item.totalCost,
//       0
//     );

//     // Calculate subTotalCost (to be sent to the client)
//     userCart.subTotalCost = userCart.items.reduce(
//       (total, item) => total + item.totalCost,
//       0
//     );

//     // Check if subTotalCost is greater than 1000 for free delivery
//     if (userCart.subTotalCost > 1000) {
//       userCart.isFreeDelivery = true;
//       userCart.deliveryFee = 0;
//     } else {
//       userCart.isFreeDelivery = false;
//       userCart.deliveryFee = 15;
//     }

//     // Save the updated cart
//     const updatedCart = await userCart.save();

//     // Return the updated cart
//     res.status(200).json({
//       success: true,
//       cart: updatedCart,
//     });
//   });

//   static viewCart = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const userCart = await MyFurCart.findOne({ user: userId }).populate(
//       "items.product"
//     );

//     if (!userCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User cart not found es" });
//     }

//     res.status(StatusCodes.OK).json({
//       success: true,
//       cart: userCart,
//     });
//   });
// }
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

  static addToCart1 = asyncHandler(async (req, res) => {
    let { user, fur_id } = req.body;
    let {
      USER,
      FUR_ID,
      widthType = "min", // O‘lchamni tanlash
      quantity = 1,
      selectedColors = [],
    } = req.body;
  
    user = USER || user;
    fur_id = FUR_ID || fur_id;
  
    // 1️⃣ Savatga qo'shish yoki yangilash
    const datas = await MyFurCart.findOneAndUpdate(
      { user: typeof user === "object" ? user._id : user },
      {
        $addToSet: { furniture: fur_id },
        $set: { user: typeof user === "object" ? user._id : user },
      },
      { upsert: true, new: true }
    ).populate([{ path: "furniture" }]);
  
    if (!datas) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Invalid ID format" });
    }
  
    // 2️⃣ Mahsulotni topish
    const product = await Product.findOne({ _id: fur_id });
    if (!product) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Mahsulot topilmadi" });
    }
  
    // 3️⃣ Narxni hisoblash (widthType ga qarab)
    let productCost =
      widthType === "max"
        ? parseFloat(product.bigCost)
        : parseFloat(product.cost);
  
    if (isNaN(productCost)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product cost" });
    }
  
    // 4️⃣ Tanlangan ranglarni tekshirish
    let availableColors = Array.isArray(product.ColorSet)
      ? product.ColorSet.flatMap((color) =>
          color.split(", ").map((c) => c.trim())
        )
      : [];
  
    const invalidColors = selectedColors.filter(
      (color) =>
        !availableColors
          .map((c) => c.toLowerCase())
          .includes(color.toLowerCase())
    );
  
    if (invalidColors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Bunday ranglar mavjud emas: ${invalidColors.join(", ")}`,
      });
    }
  
    // 5️⃣ Savatni aniqlash va mahsulotni qo‘shish
    let furniture = datas; // Savatni `datas` dan olish
  
    // 6️⃣ Mahsulotni mavjudligini tekshirish
    const existingItemIndexes = furniture.items
      .map((item, index) => ({
        index,
        match:
          item.product &&
          item.product._id.toString() === product._id.toString() &&
          item.widthType === widthType,
      }))
      .filter((item) => item.match); // Get all items with matching product ID and widthType
  
    if (existingItemIndexes.length > 0) {
      // Mavjud mahsulotlarni yangilash
      for (const { index } of existingItemIndexes) {
        const existingItem = furniture.items[index];
  
        // Agar ranglar o'zgargan bo'lsa, yangilanish
        if (
          JSON.stringify(existingItem.setColors.sort()) !==
          JSON.stringify(selectedColors.sort())
        ) {
          existingItem.setColors = selectedColors; // Ranglarni yangilash
        }
  
        // Agar miqdor o'zgargan bo'lsa, yangilanish
        if (existingItem.quantity !== quantity) {
          existingItem.quantity = quantity; // Yangi miqdorni belgilash
        }
  
        // Yangilangan narxni hisoblash
        existingItem.totalCost = existingItem.quantity * productCost; // Yangilangan narx
      }
  
      // Save changes if updated
      await furniture.save();
  
      // Subtotal va delivery fee hisoblash
      furniture.subTotalCost = furniture.items.reduce(
        (total, item) => total + item.totalCost,
        0
      );
      furniture.deliveryFee = 0; // Masalan, boshida bepul yetkazib berish
  
      return res.status(200).json({
        success: true,
        message: "Cart items updated successfully",
        datas: {
          ...datas.toObject(),
          items: datas.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            totalCost: item.totalCost,
            setColors: item.setColors,
            widthType: item.widthType,
          })),
        },
      });
    } else {
      // Yangi mahsulotni qo‘shish yoki yangilanish
      // Check if there’s an existing item with the opposite widthType (min/max)
      const oppositeWidthType = widthType === "min" ? "max" : "min";
      const existingOppositeWidthItem = furniture.items.find(
        (item) =>
          item.product &&
          item.product._id.toString() === product._id.toString() &&
          item.widthType === oppositeWidthType
      );
  
      if (existingOppositeWidthItem) {
        // If opposite widthType exists, update it to the current widthType
        existingOppositeWidthItem.widthType = widthType;
        existingOppositeWidthItem.quantity += quantity; // Add quantity if it's a match
        existingOppositeWidthItem.totalCost =
          existingOppositeWidthItem.quantity * productCost; // Recalculate total cost
  
        // Save changes
        await furniture.save();
      } else {
        // If no item exists for opposite widthType, create a new one
        furniture.items.push({
          product: product._id,
          quantity,
          totalCost: productCost * quantity,
          setColors: Array.isArray(selectedColors) ? selectedColors : [],
          widthType: widthType,
        });
  
        // Save the new item to the cart
        await furniture.save();
      }
  
      // Subtotal va delivery fee hisoblash
      furniture.subTotalCost = furniture.items.reduce(
        (total, item) => total + item.totalCost,
        0
      );
      furniture.deliveryFee = 0; // Masalan, boshida bepul yetkazib berish
  
      return res.status(201).json({
        success: true,
        message: "New item added or updated in cart",
        datas: {
          ...datas.toObject(),
          items: datas.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            totalCost: item.totalCost,
            setColors: item.setColors,
            widthType: item.widthType,
          })),
        },
      });
    }
  });
  
  static addToCart = asyncHandler(async (req, res) => {
    let { user, fur_id, widthType = "min", quantity = 1, selectedColors = [] } = req.body;
    user = req.body.USER || user;
    fur_id = req.body.FUR_ID || fur_id;
  
    const datas = await MyFurCart.findOneAndUpdate(
      { user: typeof user === "object" ? user._id : user },
      { $addToSet: { furniture: fur_id }, $set: { user: typeof user === "object" ? user._id : user } },
      { upsert: true, new: true }
    ).populate([{ path: "furniture" }]);
  
    if (!datas) return res.status(400).json({ success: false, msg: "Invalid ID format" });
  
    const product = await Product.findOne({ _id: fur_id });
    if (!product) return res.status(400).json({ success: false, msg: "Product not found" });
  
    const productCost = widthType === "max" ? parseFloat(product.bigCost) : parseFloat(product.cost);
    if (isNaN(productCost)) return res.status(400).json({ success: false, msg: "Invalid product cost" });
  
    const availableColors = Array.isArray(product.ColorSet)
      ? product.ColorSet.flatMap(c => c.split(", ").map(c => c.trim().toLowerCase()))  // Normalize colors to lowercase and trim spaces
      : [];
  
    const invalidColors = selectedColors
      .map(c => c.trim().toLowerCase())  // Normalize selected colors
      .filter(c => !availableColors.includes(c));  // Check if the normalized color exists in available colors
  
    if (invalidColors.length > 0) return res.status(400).json({ success: false, msg: `Invalid colors: ${invalidColors.join(", ")}` });
  
    let furniture = datas;
    const existingItem = furniture.items.find(item => item.product._id.toString() === product._id.toString() && item.widthType === widthType);
  
    if (existingItem) {
      if (JSON.stringify(existingItem.setColors.sort()) !== JSON.stringify(selectedColors.sort())) existingItem.setColors = selectedColors;
      if (existingItem.quantity !== quantity) existingItem.quantity = quantity;
      existingItem.totalCost = existingItem.quantity * productCost;
      await furniture.save();
    } else {
      const oppositeWidthType = widthType === "min" ? "max" : "min";
      const oppositeItem = furniture.items.find(item => item.product._id.toString() === product._id.toString() && item.widthType === oppositeWidthType);
      
      if (oppositeItem) {
        oppositeItem.widthType = widthType;
        oppositeItem.quantity = quantity;
        oppositeItem.totalCost = oppositeItem.quantity * productCost;
        oppositeItem.setColors = selectedColors;
        await furniture.save();
      } else {
        furniture.items.push({ product: product._id, quantity, totalCost: productCost * quantity, setColors: selectedColors, widthType });
        await furniture.save();
      }
    }
  
    furniture.subTotalCost = furniture.items.reduce((total, item) => total + item.totalCost, 0);
    furniture.deliveryFee = 0; // Default delivery fee
    return res.status(existingItem ? 200 : 201).json({
      success: true,
      msg: existingItem ? "Cart updated" : "Item added to cart",
      datas: { ...datas.toObject(), items: furniture.items.map(item => ({ product: item.product, quantity: item.quantity, totalCost: item.totalCost, setColors: item.setColors, widthType: item.widthType })) },
    });
  });

  static getAllCarts1 = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const searchFilter = query
    ? {
        $or: [
          { full_name: { $regex: query, $options: "i" } },
          { categories: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  const CartCount = await MyFurCart.countDocuments(searchFilter);
  const LoggedInCartCount = await MyFurCart.countDocuments({
    ...searchFilter,
    "user.lastLogin": { $ne: null },
  });

    const cartsData = await MyFurCart.find(searchFilter)
      .populate([
        {
          path: "furniture",
          select:
            "-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions",
        },
        { path: "user" },
        { path: "items" },
      ])
      .sort({ sana: -1 });

    // Furniture asosida oxirgi 30 kunni hisoblash
    const last30DaysData = Array.from({ length: 30 }, (_, index) => {
      const date = moment().subtract(index, "day").format("YYYY-MM-DD");
      const count = cartsData.reduce((acc, cart) => {
        // Furniture ichidagi har bir elementni tekshirish
        const furnitureCount = cart.furniture.filter(
          (furniture) => moment(cart.sana).format("YYYY-MM-DD") === date
        ).length;
        return acc + furnitureCount;
      }, 0);
      return { date, count };
    }).reverse();

    // **`items` obyektiga `selectedColors` qo‘shish**
    const updatedCartsData = cartsData.map((cart) => ({
      ...cart.toObject(),
      items: cart.items.map((item) => {
        // Mahsulotni `furniture` ichidan topish
        const productData = cart.furniture.find(
          (furniture) => furniture._id.toString() === item.product.toString()
        );

        return {
          product: item.product,
          quantity: item.quantity,
          totalCost: item.totalCost,
          selectedColors: productData ? productData.ColorSet : [], // ✅ Agar product bo'lsa, ColorSet olib beriladi
        };
      }),
    }));

    console.log(
      updatedCartsData.flatMap((cart) =>
        cart.items.map((item) => item.selectedColors)
      )
    );

    res.status(200).json({
      success: true,
      CartCount,
      LoggedInCartCount,
      cartsData: updatedCartsData,
      last30DaysData,
    });
  });

  static getAllCarts = asyncHandler(async (req, res) => {
    const { query } = req.query;

    const searchFilter = query
      ? {
          $or: [
            { full_name: { $regex: query, $options: "i" } },
            { categories: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    // Savatlar sonini hisoblash
    const CartCount = await MyFurCart.countDocuments(searchFilter);

    // Kirgan foydalanuvchilarning savatlar sonini hisoblash
    const LoggedInCartCount = await MyFurCart.countDocuments({
      ...searchFilter,
      "user.lastLogin": { $ne: null },
    });

    if (!CartCount) {
      return res
        .status(404)
        .json({ success: false, message: "Savat topilmadi" });
    }

    // 2️⃣ Savatdagi barcha mahsulotlarni olish
    const cartData = await MyFurCart.find(searchFilter)
    .populate([
      {
        path: "furniture",
        select:
          "-image1 -image2 -image3 -image4 -videos1 -ArmDimensions_HWD -SeatDimensions_HWD -LegHeight_CM -PackagingDimensions -Weight_KG -Assembly -CaringInstructions",
      },
      { path: "user" },
      { path: "items" },
    ])
    .sort({ sana: -1 });

    // 3️⃣ Savatdagi barcha mahsulotlar va kerakli malumotlarni ajratib olish
    const items = cartData.map((cart) => ({
      ...cart.toObject(),
      items: cart.items.map((item) => ({
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

  static cartDelet = asyncHandler(async (req, res) => {
    const { cartId, furnitureId } = req.params;

    // Savatni ID bo'yicha toping
    const cart = await MyFurCart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart topilmadi" });
    }

    // `items` ichidagi mahsulotni o'chirish
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === furnitureId
    );
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
    }

    // `furniture` ichidagi mahsulotni o'chirish
    const furnitureIndex = cart.furniture.findIndex(
      (item) => item._id.toString() === furnitureId
    );
    if (furnitureIndex !== -1) {
      cart.furniture.splice(furnitureIndex, 1);
    }

    // Agar mahsulotlar topilmasa, xabar qaytariladi
    if (itemIndex === -1 && furnitureIndex === -1) {
      return res
        .status(404)
        .json({ success: false, msg: "Mahsulot cartda topilmadi" });
    }

    // Umumiy narxni qayta hisoblash
    cart.totalCost = cart.items.reduce(
      (total, item) => total + item.totalCost,
      0
    );

    const updatedCart = await cart.save();

    res.status(200).json({
      success: true,
      cart: updatedCart,
      msg: "Mahsulot muvaffaqiyatli cartdan o'chirildi",
    });
  });

  static checkout1 = asyncHandler(async (req, res) => {
    const { furnitureId, quantity, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid furniture ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userCart = await MyFurCart.findOne({ user: userId });

    if (!userCart) {
      return res
        .status(404)
        .json({ success: false, message: "User cart not found" });
    }

    const product = await Product.findById(furnitureId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const productCost = parseFloat(product.cost);
    if (isNaN(productCost)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product cost" });
    }

    const existingProduct = userCart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );

    if (existingProduct) {
      existingProduct.quantity = quantity;
      existingProduct.totalCost = existingProduct.quantity * productCost;
    } else {
      userCart.items.push({
        product: product._id,
        quantity,
        totalCost: productCost * quantity,
      });
    }

    userCart.totalCost = userCart.items.reduce(
      (total, item) => total + item.totalCost,
      0
    );

    const updatedCart = await userCart.save();

    res.status(200).json({
      success: true,
      cart: updatedCart,
    });
  });

  static viewCart1 = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product"
    );

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

  static checkout = asyncHandler(async (req, res) => {
    const { furnitureId, quantity, userId, widthType } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(furnitureId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid furniture or user ID" });
    }

    // Find the user's cart
    let userCart = await MyFurCart.findOne({
      user: userId,
    });

    if (!userCart) {
      return res
        .status(404)
        .json({ success: false, message: "User cart not found" });
    }

    // Find the product
    const product = await Product.findById(furnitureId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Determine the product cost based on the widthType (min or max)
    let productCost =
      widthType === "max"
        ? parseFloat(product.bigCost)
        : parseFloat(product.cost);

    if (isNaN(productCost)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product cost" });
    }

    // Find the existing product in the user's cart
    const existingProduct = userCart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );

    if (existingProduct) {
      // Update the quantity and total cost
      existingProduct.quantity = quantity;
      existingProduct.totalCost = existingProduct.quantity * productCost;
    } else {
      // Add the new product with the selected quantity
      userCart.items.push({
        product: product._id,
        quantity,
        totalCost: productCost * quantity,
      });
    }

    // Recalculate the total cost for the entire cart
    userCart.totalCost = userCart.items.reduce(
      (total, item) => total + item.totalCost,
      0
    );

    // Calculate subTotalCost (to be sent to the client)
    userCart.subTotalCost = userCart.items.reduce(
      (total, item) => total + item.totalCost,
      0
    );

    // Check if subTotalCost is greater than 1000 for free delivery
    if (userCart.subTotalCost > 1000) {
      userCart.isFreeDelivery = true;
      userCart.deliveryFee = 0;
    } else {
      userCart.isFreeDelivery = false;
      userCart.deliveryFee = 15;
    }

    // Save the updated cart
    const updatedCart = await userCart.save();

    // Return the updated cart
    res.status(200).json({
      success: true,
      cart: updatedCart,
    });
  });

  static viewCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userCart = await MyFurCart.findOne({ user: userId }).populate(
      "items.product"
    );

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
