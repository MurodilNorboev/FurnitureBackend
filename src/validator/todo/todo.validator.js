import { body, param, query } from "express-validator";

// express validatorning juda kop methodi bor buni ozining websitesidan organsa boladi! 
export const addV = () => [ // isIn faqat sa va ba qabul qiladi yoki 1 va 2 ni qabul qiladi buyruqlarni kiritishni majburiy qiladi !
    body("title", "Title is requared. ").notEmpty(),  // isIn([" sa, ba "]) ~ isIn([ 1, 2 ]) ~ inInt({min: 0, max: 20 })
    body("title", "Title must be a stringd!").isString(), // isMofilePhone("any") barcha davlatlarning num ni qabul qildi!~yoki tanlab bersa bolad!
    body("desc", " Desc is requared. ").notEmpty(), // 
    body("desc", "Desc must be a stringd!").isString(),
];

export const updataV = () => [
    param('id', 'Id is MongoID').isMongoId(),
    body("title", "Title must be a string!").optional().isString(),
    body("desc", "Desc must be a string!").optional().isString(),
];
