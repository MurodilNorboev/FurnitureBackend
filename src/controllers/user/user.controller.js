import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { User } from "../../models/user/user.model.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";

export class UserController {
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
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

    const access_token = await JwtHelper.sign(user._id, user.role);

    res.status(StatusCodes.OK).json({ success: true, access_token });
  });

  static getprofile = asyncHandler(async (req, res) => {
    const data = req.body.user;
    if (!data) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }
    res.status(StatusCodes.OK).json({ success: true, data });
  });

  static addUser = asyncHandler(async (req, res) => {
    const { full_name, email, phone_number, password, role } = req.body;

    // Email tekshiruvi
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        "Bunday email mavjud."
      );
    }

    // Yangi foydalanuvchini yaratish
    const newUser = await User.create({
      full_name,
      email,
      phone_number,
      password: await HashingHelper.generatePassword(password),
      role,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Foydalanuvchi muvaffaqiyatli qo'shildi.",
      user: newUser,
    });
  });

  static userStatistics = asyncHandler(async (req, res) => {
    // Statistikani olish (masalan, umumiy foydalanuvchilar soni yoki boshqa statistikalar)
    // Misol uchun, foydalanuvchilar sonini olish:
    const userCount = await User.countDocuments();
    const adminCount = await FurUser.countDocuments();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Statistika ko'rsatilmoqda.",
      data: {
        userCount,
        adminCount,
        // boshqa statistikalar ham qo'shilishi mumkin
      },
    });
  });

  static deleteAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params; // O‘chirilishi kerak bo‘lgan adminning IDsi
    const userRole = req.body.user.role; // Tizimga kirgan foydalanuvchining roli

    if (userRole !== "super_admin") {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN,
        "Faqat Super Admin boshqa adminlarni o‘chirishga ruxsat beriladi."
      );
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Admin topilmadi."
      );
    }

    // Adminni o‘chirish
    await User.findByIdAndDelete(adminId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin muvaffaqiyatli o‘chirildi.",
    });
  });
}

/// bu otilgan signup la auftikatsiya deyladi
