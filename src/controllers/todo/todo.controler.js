import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { MyCart } from "../../models/my-cart/my.cart.madel.js";
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
    const {title, desc, image} = req.body;
    const { id } = req.params;

    const updated = {}
    if (image) {
        updated.image = image;
        // await deleteFileFroms3(todo.image.split("s3.timeweb.cloud/")[1])
    }

    const data = await Todo.findByIdAndUpdate(id, {title, desc, ...updated}, { new: true });

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
});

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

const { ObjectId } = mongoose.Types;  
export const delet = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, msg: "Invalid ID format" });
  }

  const todo = await Todo.findByIdAndDelete(id);

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




  