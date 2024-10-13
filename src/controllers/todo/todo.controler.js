import { v4 } from 'uuid';
const todo = [];

export const todoadd = ( req, res) => {
    const {title, desc} = req.body;
    todo.push({id: v4(),title, desc})
    res.status(201).json({ success: true, todo })
    console.log(title, desc);
};
export const edit = ( req, res ) => { 
    const {title, desc } = req.body;
    const { id } = req.body;
    const index = todo.findIndex((value) => value.id === id)
    todo.splice(index,1,{id, title, desc})
    res.status(200).json({ success: true, todo })
};
export const get_id = ( req, res ) => {
    const { id } = req.params;
    const data = todo.find((val) => val.id === id)
    res.status(200).json({ success: true, data})
};
export const get_all = ( req, res ) => {
    const { search } = req.query;
    const data = todo.filter((val) => val.title === search)
    res.status(200).json({ success: true, data })
};
export const delet = ( req, res ) => {
    const { delet } = req.params;
    const  data = todo.findIndex((val) => val.id === delet );
    const deletes = todo.splice(data, 1 )
     if (deletes.length > 0 ) {
        console.log("element ochirilidi"); // element ochirlganini terminalda korsatish !
     } else {
        console.log("element ochirilmadi !"); // elemtn ovhirilmaganini terminla da korsatish !
     }
    res.status(200).json({ success: true, data})
};