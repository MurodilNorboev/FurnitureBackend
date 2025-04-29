import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/http.exception.js";
import { asyncHandler } from "./asynnc-handler.middleware.js";
import { JwtHelper } from "../utils/jwt.helper.js";
import { FurUser } from "../models/Admin/user.models.js";
import { User } from "../models/user/user.model.js";

export const authF = asyncHandler(async (req, res, next) => {
  // agarda  men tokenni header ya'ni local stroragedan emas cookiedan olmoqchi bolsam = 
  // const token = req.cookies.token; // <-- cookie ichidan tokenni olamiz
  
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw new HttpException(
      StatusCodes.UNAUTHORIZED,
      ReasonPhrases.UNAUTHORIZED,
      "Token mavjud emas!"
    );
  }

  const decoded = JwtHelper.verify(token);

  if (!decoded) {
    throw new HttpException(
      StatusCodes.UNAUTHORIZED,
      ReasonPhrases.UNAUTHORIZED,
      "Token noto'g'ri!"
    );
  }

  const user =
    decoded.role === "super_admin" ||
    decoded.role === "admin_plus" ||
    decoded.role === "admin" ||
    decoded.role === "basic_admin"
      ? await (User.findById(decoded.id) || FurUser.findById(decoded.id))
      : await (FurUser.findById(decoded.id) || User.findById(decoded.id));

  if (!user) {
    throw new HttpException(
      StatusCodes.UNAUTHORIZED,
      ReasonPhrases.UNAUTHORIZED,
      "Foydalanuvchi topilmadi!"
    );
  }

  req.body.user = req.body.userId
    ? (await (User.findById(req.body.userId) ||
        FurUser.findById(req.body.userId))) || user
    : user;

  next();
});
