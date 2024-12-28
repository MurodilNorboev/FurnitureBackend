import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import mongoose from "mongoose";
import { Product } from "../../models/Admin/product.model.js";
import { MyFurCart } from "../../models/my-furCart/myFurCart.model.js";

export class Products {

static productsall =  asyncHandler(async ( req, res) => {
  const {    
    cost, chair, Assemblys, Material, customerReviews, description, CaringInstructions, NumberOfSeats, Assembly, 
    Weight_KG, PackagingDimensions, LegHeight_CM, SeatDimensions_HWD, ArmDemensions_HWD, Width, Hight, desc1,
    desc2, desc3, desc4, desc5, desc6, desc7, desc8, videos1,image, image1, image2, image3, image4, image5, image6, 
    image7, isname, label, Feature, Styles, Color, material, Hot, HotNum, issNew, Popular, types, categories 
  } = req.body;

  const new_todo = await Product.create({     
    cost, chair, Assemblys, Material, customerReviews, description, CaringInstructions, NumberOfSeats, Assembly,
    Weight_KG, PackagingDimensions, LegHeight_CM, SeatDimensions_HWD, ArmDemensions_HWD, Width, Hight, desc1, desc2, 
    desc3, desc4, desc5, desc6, desc7, desc8, videos1,image, image1, image2, image3, image4, image5, image6, image7, isname,
	  label, Feature, Styles, Color, material, Hot, HotNum, issNew, Popular, types, categories })
  

  res.status(201).json({ success: true, new_todo })
})

static productEdit = async (req, res) => {
  const {
    cost, chair, Assemblys, Material, customerReviews, description, CaringInstructions, NumberOfSeats, Assembly, 
    Weight_KG, PackagingDimensions, LegHeight_CM, SeatDimensions_HWD, ArmDemensions_HWD, Width, Hight, desc1,
    desc2, desc3, desc4, desc5, desc6, desc7, desc8, videos1, image, image1, image2, image3, image4, image5, image6, 
    image7, isname, label, Feature, Styles, Color, material, Hot, HotNum, issNew, Popular, types, categories
  } = req.body;
  const { id } = req.params;

  const updated = {};

  if (image) updated.image = image;
  if (image1) updated.image1 = image1;
  if (image2) updated.image2 = image2;
  if (image3) updated.image3 = image3;
  if (image4) updated.image4 = image4;
  if (image5) updated.image5 = image5;
  if (image6) updated.image6 = image6;
  if (image7) updated.image7 = image7;

  const data = await Product.findByIdAndUpdate(
    id,
    {
      cost, chair, Assemblys, Material, customerReviews, description, CaringInstructions, NumberOfSeats, Assembly, 
      Weight_KG, PackagingDimensions, LegHeight_CM, SeatDimensions_HWD, ArmDemensions_HWD, Width, Hight, desc1,
      desc2, desc3, desc4, desc5, desc6, desc7, desc8, ...updated, videos1, isname, label, Feature, Styles, Color, 
      material, Hot, HotNum, issNew, Popular, types, categories
    },
    { new: true }
  );

  res.status(200).json({ success: true, data });
};

static product_get_id = asyncHandler(async ( req, res ) => {
  const { id } = req.params;

  const data = await Product.findById(id);
  if (!data) {
      throw new HttpException(
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND,
      "Todo not found!" )
  }

  res.status(StatusCodes.OK).json({ success: true, data})
});

static product_get_all = async ( req, res ) => {
  const { search } = req.query;
  const query = {
      $or : []
  }
  if (search) {
      query.$or.push(
          {categories: {$regex: search, $options: 'i'}},
          {types: {$regex: search, $options: 'i'}})
  }

  const data = await Product.find(query);

  res.status(200).json({ success: true, data })
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

res.status(200).json({ success: true, data: todo, msg: "Todo muvaffaqiyatli o'chirildi" });
};

static addToCart =  asyncHandler(async ( req, res) => {
  const { user, fur_id } = req.body;

  await MyFurCart.findOneAndUpdate({user: user._id}, {$addToSet: {furniture: fur_id}, $set: { user: user._id}},
      { upsert: true }
  );

  res.status(201).json({ success: true })
});

static getCart =  asyncHandler(async ( req, res) => {
  const { user } = req.body;
  const { query } = req.query;

  const searchFilter = query
  ? {
    $or: [
      // { full_name: { $regex: query, $options: "i" } },
      { 'user.full_name': { $regex: query, $options: 'i' } }, 
      { 'user.lastName': { $regex: query, $options: 'i' } },
    ]
  } : {};

  const totalCarts = await MyFurCart.countDocuments(searchFilter);
  
  const my_carts = await MyFurCart.findOne({ user: user._id })
  .populate([
    {path: "furniture"},
    {path: "user"}

    // {path: "user", select: "full_name -_id lastName"}
  ])

  res.status(201).json({ success: true, my_carts, usersData, totalCarts })
});

static getAllCarts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const searchFilter = query
    ? {
        $or: [
          { full_name: { $regex: query, $options: 'i' } },
          { categories: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      }
    : {};

  const CartCount = await MyFurCart.countDocuments(searchFilter);

  const LoggedInCartCount = await MyFurCart.countDocuments({
    ...searchFilter,
    'user.lastLogin': { $ne: null },
  });

  const cartsData = await MyFurCart.find(searchFilter)
    .populate([
      { path: 'furniture' }, 
      { path: 'user'}, 
    ])
    .sort({ sana: -1 }); 

  res.status(200).json({
    success: true,
    CartCount,
    LoggedInCartCount,
    cartsData,
  });
});

static cartDelet = async (req, res) => {
  const { cartId, furnitureId } = req.params;  

  console.log('Cart ID from params:', req.params.cartId);
  console.log('Furniture ID from params:', req.params.furnitureId);
  
  if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(furnitureId)) {
    return res.status(400).json({ success: false, msg: "Invalid ID format" });
  }

  const cart = await MyFurCart.findById(cartId);

  if (!cart) {
    return res.status(404).json({ success: false, msg: "Cart topilmadi" });
  }
  const furnitureIndex = cart.furniture.findIndex((item) => item._id.toString() === furnitureId);

  if (furnitureIndex === -1) {
    return res.status(404).json({ success: false, msg: "Furniture topilmadi" });
  }

  cart.furniture.splice(furnitureIndex, 1);

  await cart.save();

  res.status(200).json({ success: true, data: cart, msg: "Furniture muvaffaqiyatli cartdan o'chirildi" });
};

}

