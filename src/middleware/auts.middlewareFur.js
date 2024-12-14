import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/http.exception.js";
import { asyncHandler } from "./asynnc-handler.middleware.js";
import { JwtHelper } from "../utils/jwt.helper.js";
import { User } from "../models/user/user.model.js";
import { FurUser } from "../models/FurnitureModel/furniuter.models.js"



export const authF = asyncHandler(async ( req, res, next ) => {
    let token
    // (token) orqali dekodlash amalga oshiriladi. Bu, tokenni imzo bilan tekshirish va uning ichidagi foydalanuvchi ma'lumotlarini olish uchun ishlatiladi
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]
    }
    
    if (!token) {
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            console.log(token + " token topilmadi !"),
            
        );
    }

    const decoded = JwtHelper.verify(token)
    if (!decoded) {
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            console.log(decoded + " decoded topilmadi !"), 
        );
    }
    //// decoded.id orqali foydalanuvchi ma'lumotlarini User.findById(decoded.id) yordamida ma'lumotlar bazasidan izlaydi.
    const user = await FurUser.findById(decoded.id) 
    /// Agar foydalanuvchi topilsa, uning ma'lumotlari req.body.userga saqlanadi va keyingi middleware yoki controllerga yuboriladi.
    if (!user) { 
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            console.log(user + " user topilmadi :: !"), 
        );
    }

    req.body.user = user;
    
    next();  /// next() bu yerda keyingi middleware yoki controllerga o'tish uchun chaqiriladi.
})