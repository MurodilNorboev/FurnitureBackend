import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import mongoose from "mongoose";
import { Product } from "../../models/Admin/product.model.js";

export const productsall =  asyncHandler(async ( req, res) => {
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

export const productEdit = async (req, res) => {
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

export const product_get_id = asyncHandler(async ( req, res ) => {
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

export const product_get_all = async ( req, res ) => {
  const { search } = req.query;
  const query = {
      $or : []
  }
  if (search) {
      query.$or.push(
          {title: {$regex: search, $options: 'i'}},
          {desc: {$regex: search, $options: 'i'}})
  }

  const data = await Product.find(query);

  res.status(200).json({ success: true, data })
};

const { ObjectId } = mongoose.Types;  
export const delet = async (req, res) => {
const { id } = req.params;

if (!ObjectId.isValid(id)) {
  return res.status(400).json({ success: false, msg: "Invalid ID format" });
}

const todo = await Product.findByIdAndDelete(id);

//   await deleteFileFroms3(todo.image.split("s3.timeweb.cloud")[1])

if (!todo) {
  return res.status(404).json({ success: false, msg: "Todo topilmadi" });
}

res.status(200).json({ success: true, data: todo, msg: "Todo muvaffaqiyatli o'chirildi" });
};

export const addToCart =  asyncHandler(async ( req, res) => {
  const { user, car_id } = req.body;

  await MyCart.findOneAndUpdate({user: user._id}, {$addToSet: {cars: car_id}, $set: { user: user._id}},
      { upsert: true }
  );

  res.status(201).json({ success: true })
});

export const getCart =  asyncHandler(async ( req, res) => {
  const { user } = req.body;

  const my_cart = await MyCart.findOne(
      {user: user._id})
      .populate([
          {path: 'cars', select: "title"},
          {path: "user", select: "full_name"},
      ]);

  res.status(201).json({ success: true, my_cart })
});
