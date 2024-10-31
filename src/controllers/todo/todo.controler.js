import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { Todo } from "../../models/todo/todo.model.js";
import { HttpException } from "../../utils/http.exception.js";
import { StatusCodes,ReasonPhrases }  from 'http-status-codes'

export const todoadd = asyncHandler(async ( req, res) => {
    const {title, desc} = req.body;

    const new_todo = await Todo.create({ title, desc })

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
export const delet = async ( req, res ) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, data, msg:"successfull file" },)
};