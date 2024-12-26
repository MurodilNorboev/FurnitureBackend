import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/http.exception.js";
import { asyncHandler } from "./asynnc-handler.middleware.js";
import { JwtHelper } from "../utils/jwt.helper.js";
import { User } from "../models/user/user.model.js";
import { FurUser } from "../models/Admin/user.models.js";

export const auth = asyncHandler(async (req, res, next) => {
    let token;

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

    const decoded = JwtHelper.verify(token);
    if (!decoded) {
        console.log('decoded topilmadi!' + decoded);
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            "Token noto'g'ri!"
        );
    }

    let user;

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
        console.log('user topilmadi :', !user);
        req.body.user = user;
        return next();
    }
    req.body.user = user;
    next();
});
