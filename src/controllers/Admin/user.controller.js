import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";
import { FurUser } from "../../models/Admin/user.models.js";
import mongoose from "mongoose";
import { generateOTP } from "../../utils/generate.otp.js";
import MailService from "../../service/mail.service.js";

let storedOTP = null;
let otpExpirationTime = null; // Amal qilish muddatini saqlash uchun degisken

export class FurnitureUserController {
  static signUp = asyncHandler(async (req, res) => {
    const {
      full_name,
      lastName,
      phone_number,
      email,
      password,
      address: { country, city, street, apartmant, zip_code },
      comment,
    } = req.body;

    // Проверка на существующий email
    const existingUser = await FurUser.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        "This email is already used!"
      );
    }
    const newUser = await FurUser.create({
      full_name,
      lastName,
      phone_number,
      email,
      password: await HashingHelper.generatePassword(password),
      address: { country, city, street, apartmant, zip_code },
      comment,
    });

    const otp = generateOTP();
    newUser.otp = otp;
    newUser.otpExpiration = Date.now() + 5 * 60 * 1000; // OTPning amal qilish muddati 5 daqiqa
    await newUser.save();
    const emailBody = `Your OTP for activation is: ${otp}. It will expire in 15 minutes.`;
    await MailService.sendMail(email, "Account Activation OTP", emailBody);
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Successfully signed up! Please check your email for the OTP to activate your account.",
    });
  });

  //   static signUp = asyncHandler(async (req, res) => {
  //     const {
  //       full_name,
  //       lastName,
  //       phone_number,
  //       email,
  //       password,
  //       address: { country, city, street, apartmant, zip_code },
  //       comment,
  //     } = req.body;

  //     const user = await FurUser.findOne({ email });
  //     if (user) {
  //       throw new HttpException(
  //         StatusCodes.UNAUTHORIZED,
  //         ReasonPhrases.UNAUTHORIZED,
  //         "This email already used!"
  //       );
  //     }

  //     await FurUser.create({
  //       full_name,
  //       lastName,
  //       phone_number,
  //       email,
  //       password: await HashingHelper.generatePassword(password),
  //       address: { country, city, street, apartmant, zip_code },
  //       comment,
  //     });

  //     const otp = generateOTP();
  //     user.otp = otp;
  //     user.otpExpiration = Date.now() + 5 * 60 * 1000;
  //     await user.save();

  //     const emailBody = `Your OTP for activation is: ${otp}. It will expire in 15 minutes.`;
  //     await MailService.sendMail(email, "Account Activation OTP", emailBody);

  //     res.status(StatusCodes.CREATED).json({
  //       success: true,
  //       msg: "Successfully signed up! Please check your email for the OTP to activate your account.",
  //     });
  //   });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await FurUser.findOne({ email }).select("+password");

    if (!user) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        "Invalid login credentials!"
      );
    }
    if (!(await HashingHelper.comparePassword(password, user.password))) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        "Invalid login credentials!"
      );
    }

    const access_token = await JwtHelper.sign(user._id);
    console.log(email, user, password);
    res.status(StatusCodes.OK).json({ success: true, access_token });
  });

  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    // 1. Foydalanuvchi mavjudligini tekshirish
    const user = await FurUser.findOne({ email });
    // if (!user.otp || user.otp !== otp || user.otpExpiration < Date.now()) {
    //     throw new HttpException(
    //         StatusCodes.NOT_FOUND,
    //         ReasonPhrases.NOT_FOUND,
    //         "User not found!"
    //       );
    // }
    if (!user) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "User not found!"
      );
    }
    // 2. Yangi OTP yaratish
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + 5 * 60 * 1000; // OTP 5 daqiqa davomida amal qiladi

    await user.save();

    // 3. Email yuborish
    const emailBody = `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`;
    await MailService.sendMail(email, "Password Reset OTP", emailBody);

    // 4. Javob qaytarish
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Password reset OTP has been sent to your email. Please check your inbox.",
    });
  });

  static resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await FurUser.findOne({ email });

    if (!user) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "User not found!"
      );
    }

    // 5. OTPni tekshirish va amal qilish muddati
    if (!user.otp || user.otp !== otp || user.otpExpiration < Date.now()) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        "Invalid or expired OTP!"
      );
    }

    // 6. Parolni yangilash
    user.password = await HashingHelper.generatePassword(newPassword);
    user.otp = null; // OTPni o'chirish
    user.otpExpiration = null; // OTP muddati o'chirish
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Password has been successfully updated!",
    });
  });

  static sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const existingUser = await FurUser.findOne({ email });
    if (!existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Email is already used!",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    storedOTP = otp;
    otpExpirationTime = Date.now() + 5 * 60 * 1000;
    await MailService.sendMail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent successfully.",
    });
  });

  static VerifyOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    console.log(otp);

    if (!storedOTP || Date.now() > otpExpirationTime) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "OTP amal qilish muddati tugagan.",
      });
    }
    if (parseInt(otp, 10) === storedOTP) {
      storedOTP = null; // Clear OTP after successful verification
      otpExpirationTime = null; // Clear expiration time
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "OTP muvaffaqiyatli tasdiqlandi!",
      });
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "OTP noto'g'ri.",
    });
  });

  //   === !! ====

  static getMe = asyncHandler(async (req, res) => {
    const user = req.body.user;

    res.status(StatusCodes.OK).json({ success: true, data: user });
  });

  static updateUser = asyncHandler(async (req, res) => {
    const {
      full_name,
      lastName,
      email,
      phone_number,
      password,
      address: { country, city, street, apartmant, zip_code },
      comment,
    } = req.body;
    const { id } = req.params;

    const user = await FurUser.findByIdAndUpdate(
      id,
      {
        full_name,
        lastName,
        email,
        phone_number,
        password,
        address: {
          country,
          city,
          street,
          apartmant,
          zip_code,
        },
        comment,
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({ success: true, user });
  });

  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid ID format" });
    }

    const user = await FurUser.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User topilmadi!" });
    }

    res.status(200).json({
      success: true,
      data: user,
      msg: "User muvaffaqiyatli o'chirildi",
    });
  });

  static getUserCount = asyncHandler(async (req, res) => {
    const { query } = req.query;

    const searchFilter = query
      ? {
          $or: [
            { full_name: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const UserCount = await FurUser.countDocuments(searchFilter);

    const LoggedInUserCount = await FurUser.countDocuments({
      ...searchFilter,
      lastLogin: { $ne: null },
    });

    const usersData = await FurUser.find(
      searchFilter,
      `full_name 
             lastName
             email 
             phone_number 
             address.country 
             address.city 
             address.street
             address.apartmant
             address.zip_code
             comment
             sana`
    );

    res.status(StatusCodes.OK).json({
      success: true,
      UserCount,
      LoggedInUserCount,
      usersData,
    });
  });
}
