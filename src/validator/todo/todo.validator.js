import { body, param, query } from "express-validator";

// express validatorning juda kop methodi bor buni ozining websitesidan organsa boladi! 
export const addV = () => [ // isIn faqat sa va ba qabul qiladi yoki 1 va 2 ni qabul qiladi buyruqlarni kiritishni majburiy qiladi !
   body("title", "Title is requared. ").notEmpty(),  /// isIn([" sa, ba "]) ~ isIn([ 1, 2 ]) ~ inInt({min: 0, max: 20 })
   body("title", "Title must be a stringd!").isString(), // isMofilePhone("any") barcha davlatlarning num ni qabul qildi!~yoki tanlab bersa bolad!
   body("desc", " Desc is requared. ").notEmpty(), // 
   body("desc", "Desc must be a stringd!").isString(),
];

export const updataV = () => [
    param('id', 'Id is MongoID').isMongoId(),
    body("title", "Title must be a string!").optional().isString(),
    body("desc", "Desc must be a string!").optional().isString(),
];

export const signupV = () => [
    body('full_name','Full name is required').notEmpty(),
    body('phone_number', 'Phone number is required').isMobilePhone(),
    body('email','INvalid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6, max: 20 }),
    body('password', 'Password must be between 8 and 20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
    .isLength({ min: 8, max: 20 }) 
    .matches(/[A-Z]/) 
    .matches(/[a-z]/) 
    .matches(/[0-9]/) 
    .matches(/[!@#$%^&*(),.?":{}|<>]/) 
]

export const loginV = () => [
    body('email', 'Invalid Email')
    .isEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage('Only Gmail emails are allowed'),

    body('password', 'password is requared').notEmpty(),
    body('password', 'Password must be between 8 and 20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
    .isLength({ min: 8, max: 20 }) 
    .matches(/[A-Z]/) 
    .matches(/[a-z]/) 
    .matches(/[0-9]/) 
    .matches(/[!@#$%^&*(),.?":{}|<>]/) 
]
