import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Todo } from "../../models/todo/todo.model.js";
import { HttpException } from "../../utils/http.exception.js";
import { StatusCodes,ReasonPhrases }  from 'http-status-codes'
import mongoose from 'mongoose';

export const todoadd =  asyncHandler(async ( req, res) => {
    const {title, desc, image} = req.body;

    const new_todo = await Todo.create({ title, desc, image })
    

    res.status(201).json({ success: true, new_todo })
})
export const edit = async ( req, res ) => { 
    const {title, desc } = req.body;
    const { id } = req.params;

    const data = await Todo.findByIdAndUpdate(id, {title,desc}, { new: true });

    res.status(200).json({ success: true, data });
};
export const get_id = asyncHandler(async ( req, res ) => {
    const { id } = req.params;

    const data = await Todo.findById(id);
    if (!data) {
        throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
        "Todo not found!" )
    }

    res.status(StatusCodes.OK).json({ success: true, data})
})
export const get_all = async ( req, res ) => {
    const { search } = req.query;
    const query = {
        $or : []
    }
    if (search) {
        query.$or.push(
            {title: {$regex: search, $options: 'i'}},
            {desc: {$regex: search, $options: 'i'}})
    }

    const data = await Todo.find(query);

    res.status(200).json({ success: true, data })
};
// export const delet = async ( req, res ) => {
//     const { id } = req.params;
//     await Todo.findByIdAndDelete(id);
    
//     res.status(200).json({ success: true, data, msg:"successfull file" },)
// };
const { ObjectId } = mongoose.Types;  // ObjectId ni olish
export const delet = async (req, res) => {
  const { id } = req.params;

  // ID formatini tekshirish
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, msg: "Invalid ID format" });
  }

  // Todo ni bazadan o'chirish
  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    return res.status(404).json({ success: false, msg: "Todo topilmadi" });
  }

  // O'chirilgan todo bilan javob yuborish
  res.status(200).json({ success: true, data: todo, msg: "Todo muvaffaqiyatli o'chirildi" });
};

  