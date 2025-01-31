import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/http.exception.js";
import { asyncHandler } from "./asynnc-handler.middleware.js";
import { JwtHelper } from "../utils/jwt.helper.js";
import { User } from "../models/user/user.model.js";
import { FurUser } from "../models/Admin/user.models.js";

export const auth = asyncHandler(async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization; // Headerni olish

        // Header mavjudligini tekshirish
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token topilmadi!" });
        }
  
    // Tokenni olish
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      console.log("Token topilmadi!");
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        "Token topilmadi!"
      );
    }

    let decoded;

    // Tokenni dekodlash va xatoliklarni ushlash
    try {
      decoded = JwtHelper.verify(token);
    } catch (error) {
      console.log('Token dekodlanmadi: ', error);
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




// export const auth1 = asyncHandler(async(req,res,next)=>{
//   let token; 

//   if(req.headers.authorization?.startsWith("Bearer")){
//       token = req.headers.authorization.split(" ")[1];
//   }
//   if(!token){
//       throw new HttpException(
//           StatusCodes.UNAUTHORIZED,
//           ReasonPhrases.UNAUTHORIZED,
//           ReasonPhrases.UNAUTHORIZED,
//       ); 
//   } 
//   const decoded = JwtHelper.verify(token);
//   console.log(token ,"bu token");
  
//   if(!decoded){
//       throw new HttpException(
//           StatusCodes.UNAUTHORIZED,
//           ReasonPhrases.UNAUTHORIZED,
//           ReasonPhrases.UNAUTHORIZED,
//       ); 
//   } 
//   console.log(decoded,"bu decoded");
//   const user = await User.findById(decoded.id)

//   if(!user){
//           throw new HttpException(
//               StatusCodes.UNAUTHORIZED,
//               ReasonPhrases.UNAUTHORIZED,
//               ReasonPhrases.UNAUTHORIZED,
//           ); 
//       } 
//       req.body.user = user;
//       console.log(user,"bu user");
//   next();
// })
