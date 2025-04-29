import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { HttpException } from "../../utils/http.exception.js";
import { FurUser } from "../../models/Admin/user.models.js";
import { generateOTP } from "../../utils/generate.otp.js";
import MailService from "../../service/mail.service.js";
import { JwtHelper } from "../../utils/jwt.helper.js";
import mongoose from "mongoose";
import moment from "moment/moment.js";
let storedOTP = null;
let otpExpirationTime = null;
let pendingUser = null;

export class FurnitureUserController {
  // sig-up/ verify-OTP / login
  static signUp = asyncHandler(async (req, res) => {
    const {
      full_name,
      lastName,
      phone_number,
      email,
      password,
      address,
      comment,
    } = req.body;

    // Emailni tekshirish
    const existingUser = await FurUser.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        ReasonPhrases.CONFLICT,
        "Bu email allaqachon ishlatilgan!"
      );
    }

    // Yangi foydalanuvchining ma'lumotlarini vaqtinchalik saqlash
    pendingUser = {
      full_name,
      lastName,
      phone_number,
      email,
      password: await HashingHelper.generatePassword(password),
      address,
      comment,
      isActive: false, // Hali aktiv emas
      otp: generateOTP(), // OTP yaratish
      otpExpiration: Date.now() + 5 * 60 * 1000, // OTP muddatini belgilash (5 daqiqa)
    };

    // OTP yuborish
    const emailBody = `Sizning aktivatsiya uchun OTP kodingiz: ${pendingUser.otp}. U 5 daqiqa ichida amal qiladi.`;
    await MailService.sendMail(
      email,
      "Hisobingizni aktivlashtirish uchun OTP",
      emailBody
    );

    // Javob yuborish
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Ro'yxatdan o'tdingiz! Iltimos, hisobni aktivlashtirish uchun emailingizni tekshirib ko'ring.",
    });
  });
  static VerifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;

    if (!pendingUser || pendingUser.email !== email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki xatolik yuz berdi.",
      });
    }

    if (Date.now() > pendingUser.otpExpiration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "OTP muddati tugagan.",
      });
    }

    if (parseInt(otp, 10) === pendingUser.otp) {
      // ✅ Foydalanuvchi bazaga saqlanadi
      await FurUser.create({
        ...pendingUser,
        isActive: true,
      });

      pendingUser = null; // O'zgaruvchini tozalash

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Hisobingiz muvaffaqiyatli aktivlashtirildi!",
      });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "OTP noto'g'ri.",
    });
  });
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

    // Foydalanuvchi aktiv bo'lishi kerak
    if (!user.isActive) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
        "Your account is not activated. Please check your email for activation."
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
    res.status(StatusCodes.OK).json({ success: true, access_token });

  //     // HTTPOnly cookie sifatida tokenni yuborish
  // res.cookie("token", access_token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production", // faqat HTTPSda ishlasin
  //   sameSite: "Strict",
  //   maxAge: 1000 * 60 * 60 * 24 * 30, // 30 kun
  // });

  // // Javob
  // res.status(StatusCodes.OK).json({
  //   success: true,
  //   message: "Login muvaffaqiyatli!",
  //   user: {
  //     id: user._id,
  //     email: user.email,
  //     role: user.role,
  //   },

  });

  // == forgot password / reset password / change possword ==
  static forgotPassword = asyncHandler(async (req, res) => {
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
  static resetPassword = asyncHandler(async (req, res) => {
    const { otp, email, newPassword } = req.body;

    // 1. Email orqali foydalanuvchini qidirish
    const user = await FurUser.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Foydalanuvchi topilmadi!",
      });
    }

    // 2. OTPni tekshirish
    if (!storedOTP || Date.now() > otpExpirationTime) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "OTP amal qilish muddati tugagan.",
      });
    }

    if (parseInt(otp, 10) !== storedOTP) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Noto‘g‘ri OTP!",
      });
    }

    // 3. OTP to‘g‘ri bo‘lsa, uni o‘chiramiz va yangi parolni saqlaymiz
    storedOTP = null; // OTPni tozalash
    otpExpirationTime = null; // Muddati tugagan vaqtni tozalash

    // 4. Yangi parolni o‘rnatish
    user.password = await HashingHelper.generatePassword(newPassword);
    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Parol muvaffaqiyatli yangilandi!",
    });
  });
  static changePassword = asyncHandler(async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    // 1. Foydalanuvchini topish va parolini olish
    const user = await FurUser.findOne({ email }).select("+password"); // `password` ni olish uchun qo‘shildi

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Foydalanuvchi topilmadi!",
      });
    }

    // 2. Foydalanuvchining paroli mavjudligini tekshirish
    if (!user.password) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          "Foydalanuvchi paroli topilmadi! Iltimos, administrator bilan bog‘laning.",
      });
    }

    // 3. Eski parolni tekshirish
    const isPasswordValid = await HashingHelper.comparePassword(
      oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Eski parol noto‘g‘ri!",
      });
    }

    // 4. Yangi parolni shifrlash va yangilash
    user.password = await HashingHelper.generatePassword(newPassword);
    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Parol muvaffaqiyatli o‘zgartirildi!",
    });
  });

  //   === me / updateUser / deleteUser ====
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

  // === userCount / userTrand / userLocation / userRealTime ===
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
  static getUserTrends = asyncHandler(async (req, res) => {
      const { period } = req.query;
      let groupFormat = "%Y-%m-%d"; // Default: kunlik

      if (period === "weekly") groupFormat = "%Y-%U"; // Haftalik
      else if (period === "monthly") groupFormat = "%Y-%m"; // Oylik

      const trends = await FurUser.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: groupFormat, date: "$sana" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      if (!trends) {
          return res.status(404).json({ message: "Trends not found" });
      }

      res.status(200).json({ trends });
  });
  static getUserLocations = asyncHandler(async (req, res) => {
      const locations = await FurUser.aggregate([
        {
          $group: {
            _id: "$address.country",
            count: { $sum: 1 },
          },
        },
      ]);
      if (!locations) {
          return res.status(404).json({ message: "Locations not found" });
      }
      res.status(200).json({ locations });
  });

  static getRealTimeUsers = asyncHandler(async (req, res) => {
      const todayStart = moment().startOf("day").toDate();
      const todayEnd = moment().endOf("day").toDate();

      // Yangi foydalanuvchilarni bugungi sanaga qarab tekshirish
      const newUsersToday = await FurUser.countDocuments({
        isActive: true,
        sana: { $gte: todayStart, $lt: todayEnd }, // sana nomi
      });
      if (!newUsersToday) {
          return res.status(404).json({ message: "New users not found" });
      }

      const onlineUsers = await FurUser.countDocuments({ isActive: true });

      res.status(200).json({ onlineUsers, newUsersToday });
  });
}
