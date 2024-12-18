import { body, param, query } from "express-validator";

// express validatorning juda kop methodi bor buni ozining websitesidan organsa boladi! 
export const addV = () => [ // isIn faqat sa va ba qabul qiladi yoki 1 va 2 ni qabul qiladi buyruqlarni kiritishni majburiy qiladi !
   body("title", "Title is requared. ").notEmpty(),  /// isIn([" sa, ba "]) ~ isIn([ 1, 2 ]) ~ inInt({min: 0, max: 20 })
   body("title", "Title must be a string!").isString(), // isMofilePhone("any") barcha davlatlarning num ni qabul qildi!~yoki tanlab bersa bolad!
   body("desc", " Desc is requared. ").notEmpty(), // 
   body("desc", "Desc must be a string!").isString(),
];

export const EventAddV = () => [
    body("titles", "Titles is requared. ").notEmpty(),
    body("titles", "Titles must be a stringd!").isString()
]

export const updataV = () => [
    param('id', 'Id is MongoID').isMongoId(),
    body("title", "Title must be a string!").optional().isString(),
    body("desc", "Desc must be a string!").optional().isString(),
];

export const signupV = () => [
    body('full_name', 'Full name is required').notEmpty(),
    body('email', 'Invalid email')
        .isEmail()
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage('Only Gmail emails are allowed'),
        body('phone_number', 'Phone number is required')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number format')
        .matches(/^\+010|\+8210|\+998\d{7,11}$/).withMessage('Phone number must start with +010, +8210, or +998 and be between 9 and 15 digits'),
    body('password', 'Password is required!')
        .isLength({ min: 8, max: 20 })
        .custom(value => {
            const criteriaCount = [
                /[a]/.test(value),   // Kichik harf
                /[A]/.test(value),   // Katta harf
                /\d/.test(value),      // Raqam
                /[!@#$%^&*()_+]/.test(value) // Maxsus belgi
            ].filter(Boolean).length; // Haqiqiy qiymatlarni sanash
            if (criteriaCount < 3) {
                throw new Error('Password must contain at least 3 of the following: lowercase letter, uppercase letter, digit, special character.');
            }
            return true;
        })

];

export const loginV = () => [
    body('email', 'Invalid email')
        .isEmail()
        .isEmail()
        // .matches(/^[a-zA-Z0-3._%+-?]+@gmail\.com$/)
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage('Only Gmail emails are allowed'),
    body('password', 'Password is required!')
        .isLength({ min: 8, max: 20 })
];

export const addCartV = () => [
    body("car_id", "Car ID is MongoID")
];


// loyiha userlari validatori ! 
export const signupFurV = () => [
    body('full_name', 'Full name is required').notEmpty(),
    body('lastName', 'lastName is required').notEmpty(),
    body('email', 'Invalid email')
        .isEmail()
        // .matches(/^[a-zA-Z0-3._%+-?]+@gmail\.com$/)
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage('Only Gmail emails are allowed'),
    body('phone_number', 'Phone number is required').isMobilePhone(),
    body('password', 'Password is required!')
        .isLength({ min: 8, max: 20 })
        .custom(value => {
            const criteriaCount = [
                /[a]/.test(value),   // Kichik harf
                /[A]/.test(value),   // Katta harf
                /\d/.test(value),      // Raqam
                /[!@#$%^&*()_+]/.test(value) // Maxsus belgi
            ].filter(Boolean).length; // Haqiqiy qiymatlarni sanash
            if (criteriaCount < 3) {
                throw new Error('Password must contain at least 3 of the following: lowercase letter, uppercase letter, digit, special character.');
            }
            return true;
        }),
    body('address', 'address is required'),
    body('address.country', 'Country is required').notEmpty(),
    body('address.city', 'City is required').notEmpty(),
    body('address.street', 'Street is required').notEmpty(),
    body('address.apartment', 'Apartment is required').notEmpty(),
    body('address.zip_code', 'ZIP code is required').notEmpty(),
    body('comment', 'comment is required')

];

export const loginFurV = () => [
    body('email', 'Invalid email')
        .isEmail()
        .isEmail()
        // .matches(/^[a-zA-Z0-3._%+-?]+@gmail\.com$/)
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage('Only Gmail emails are allowed'),
    body('password', 'Password is required!')
        .isLength({ min: 8, max: 20 })
];

