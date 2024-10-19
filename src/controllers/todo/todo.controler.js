import { Todo } from "../../models/todo/todo.model.js";

export const todoadd = async ( req, res) => {
    try {
    const {title, desc} = req.body;

    const new_todo = await Todo.create({ title, desc })

    res.status(201).json({ success: true, new_todo })
    } catch (error) {
        console.log(error)
    }
};
export const edit = async ( req, res ) => { 
    const {title, desc } = req.body;
    const { id } = req.params;

    const data = await Todo.findByIdAndUpdate(id, {title,desc}, { new: true });

    res.status(200).json({ success: true, data });
};
export const get_id = async ( req, res ) => {
    const { id } = req.params;
    const data = await Todo.findById(id);
    res.status(200).json({ success: true, data})
};
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