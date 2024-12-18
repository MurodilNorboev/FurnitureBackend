import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Product, Textil, Table } from "../../models/Admin/product.model.js";
import { HttpException } from "../../utils/http.exception.js";
import mongoose from "mongoose";

const modelMap = {
  products: { model: Product, fields: ["title", "desc", "image", "image1"] },
  textils: { model: Textil, fields: ["title", "desc", "image", "width", "height"] },
  tables: { model: Table, fields: ["title", "desc", "image", "material", "height"] },
};
const getModel = (type) => {
  const entry = modelMap[type];
  if (!entry) throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid type");
  return entry;
};
const validateFields = (fields, body) => {
  const validatedData = {};
  for (const field of fields) {
    if (body[field] !== undefined) validatedData[field] = body[field];
  }
  return validatedData;
};

export const productsall = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { model, fields } = getModel(type);

  const validatedData = validateFields(fields, req.body);
  const newItem = await model.create(validatedData);

  res.status(StatusCodes.CREATED).json({ success: true, data: newItem });
});

export const product_get_all = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { search } = req.query;
  const { model, fields } = getModel(type);

  const query = {
    $or: [],
  };

  if (search) {
    query.$or.push(
      { title: { $regex: search, $options: 'i' } },  
      { desc: { $regex: search, $options: 'i' } }   
    );
  }
  const items = await model.find(query);

  res.status(StatusCodes.OK).json({ success: true, data: items });
});

export const product_get_id = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { model } = getModel(type);

  const itmes = await model.findById(id);
      if (!itmes) {
        throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            "Todo not found!"
        )
    }
  res.status(StatusCodes.OK).json({ success: true, data: itmes})
})

export const productEdit = asyncHandler(async (req, res) => {
  const { id, type } = req.params;
  const { model, fields } = getModel(type);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid ID format");
  }

  const validatedData = validateFields(fields, req.body);
  const updatedItem = await model.findByIdAndUpdate(id, validatedData, { new: true });

  if (!updatedItem) {
    throw new HttpException(StatusCodes.NOT_FOUND, "Item not found");
  }

  res.status(StatusCodes.OK).json({ success: true, data: updatedItem });
});

export const delet = asyncHandler(async (req, res) => {
  const { id, type } = req.params;
  const { model } = getModel(type);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid ID format");
  }

  const deletedItem = await model.findByIdAndDelete(id);

  if (!deletedItem) {
    throw new HttpException(StatusCodes.NOT_FOUND, "Item not found");
  }

  res.status(StatusCodes.OK).json({ success: true, data: deletedItem });
});
