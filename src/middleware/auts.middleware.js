import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/http.exception.js";
import { asyncHandler } from "./asynnc-handler.middleware.js";
import { JwtHelper } from "../utils/jwt.helper.js";
import { User } from "../models/user/user.model.js";
import { FurUser } from "../models/Admin/user.models.js";




export const auth = asyncHandler(async (req, res, next) => {
    let token;
  
    // Tokenni olish
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      console.log("Token topilmadi!" + token);
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        "Token topilmadi!"
      );
    }
  
    // Tokenni dekodlash
    const decoded = JwtHelper.verify(token);
    if (!decoded) {
      console.log('Token dekodlanmadi: ', decoded);
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        "Token noto'g'ri!"
      );
    }
  
    let user;
  
    // Adminni tekshirish
    if (decoded.role === 'admin') {
      console.log("Admin tekshirilmoqda...");
      user = await User.findById(decoded.id);
      if (!user) {
        console.log("Admin topilmadi!");
        throw new HttpException(
          StatusCodes.UNAUTHORIZED,
          ReasonPhrases.UNAUTHORIZED,
          "Admin topilmadi!"
        );
      }
      req.body.user = user;
      return next();
    }
  
    // FurUserni tekshirish
    user = await FurUser.findById(decoded.id);
  
    if (!user) {        
      user = await User.findById(decoded.id);
      if (!user) {
        console.log("Furni yoki Admin foydalanuvchi topilmadi!");
        throw new HttpException(
          StatusCodes.UNAUTHORIZED,
          ReasonPhrases.UNAUTHORIZED,
          "Furni yoki Admin foydalanuvchi topilmadi!"
        );
      }
      req.body.user = user;
      return next();
    }
    
    req.body.user = user;
    next();
  });










// import { ReasonPhrases, StatusCodes } from "http-status-codes";
// import { HttpException } from "../utils/http.exception.js";
// import { asyncHandler } from "./asynnc-handler.middleware.js";
// import { JwtHelper } from "../utils/jwt.helper.js";
// import { User } from "../models/user/user.model.js";



// export const auth = asyncHandler(async ( req, res, next ) => {
//     let token
//     // (token) orqali dekodlash amalga oshiriladi. Bu, tokenni imzo bilan tekshirish va uning ichidagi foydalanuvchi ma'lumotlarini olish uchun ishlatiladi
//     if (req.headers.authorization?.startsWith('Bearer')) {
//         token = req.headers.authorization.split(" ")[1]
//     }
    
//     if (!token) {
//         throw new HttpException(
//             StatusCodes.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             console.log(token + " token topilmadi !"),
            
//         );
//     }

//     const decoded = JwtHelper.verify(token)
//     if (!decoded) {
//         throw new HttpException(
//             StatusCodes.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             console.log(decoded + " decoded topilmadi !"), 
//         );
//     }
//     //// decoded.id orqali foydalanuvchi ma'lumotlarini User.findById(decoded.id) yordamida ma'lumotlar bazasidan izlaydi.
//     const user = await User.findById(decoded.id) 
//     /// Agar foydalanuvchi topilsa, uning ma'lumotlari req.body.userga saqlanadi va keyingi middleware yoki controllerga yuboriladi.
//     if (!user) { 
//         throw new HttpException(
//             StatusCodes.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             console.log(user + " user topilmadi !"), 
//         );
//     }

//     req.body.user = user;
    
//     next();  /// next() bu yerda keyingi middleware yoki controllerga o'tish uchun chaqiriladi.
// })

// bu yozilgan midlware aftorisetion deyiladi !



// import { ReasonPhrases, StatusCodes } from "http-status-codes";
// import { HttpException } from "../utils/http.exception.js";
// import { asyncHandler } from "./asynnc-handler.middleware.js";
// import { JwtHelper } from "../utils/jwt.helper.js";
// import { User } from "../models/user/user.model.js";
// import { FurUser } from "../models/Admin/user.models.js";

// export const auth = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization?.startsWith('Bearer')) {
//         token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//         console.log("Token topilmadi!" + token);
//         throw new HttpException(
//             StatusCodes.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             "Token topilmadi!"
//         );
//     }

//     const decoded = JwtHelper.verify(token);
//     if (!decoded) {
//         console.log('decoded topilmadi!' + decoded);
//         throw new HttpException(
//             StatusCodes.UNAUTHORIZED,
//             ReasonPhrases.UNAUTHORIZED,
//             "Token noto'g'ri!"
//         );
//     }

//     let user;

//     if (decoded.role === 'admin') {
//         console.log("Admin tekshirilmoqda...");
//         user = await User.findById(decoded.id);
//         if (!user) {
//             console.log("Admin topilmadi!");
//             throw new HttpException(
//                 StatusCodes.UNAUTHORIZED,
//                 ReasonPhrases.UNAUTHORIZED,
//                 "Admin topilmadi!"
//             );
//         }
//         req.body.user = user;
//         return next();
//     }

//     user = await FurUser.findById(decoded.id);
    
//     if (!user) {        
//         user = await User.findById(decoded.id);
//         if (!user) {
//             console.log("Furni yoki Admin foydalanuvchi topilmadi!");
//             throw new HttpException(
//                 StatusCodes.UNAUTHORIZED,
//                 ReasonPhrases.UNAUTHORIZED,
//                 "Furni yoki Admin foydalanuvchi topilmadi!"
//             );
            
//         }
//         console.log('user topilmadi :', !user);
//         req.body.user = user;
//         return next();
//     }
//     req.body.user = user;
//     next();
// });

