import { body, param, query } from "express-validator";


export const signupV = () => [
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
