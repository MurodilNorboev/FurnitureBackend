import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { User } from "../../models/user/user.model.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";
import { FurUser } from "../../models/Admin/user.models.js";

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

    const user = await User.find(data);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }
    res.status(StatusCodes.OK).json({ success: true, user });
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
    try {
      const userCount = await FurUser.countDocuments(); 
      const adminCount = await User.countDocuments(); 
      const allAdmins = await User.find({}, "-password"); 

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Statistika ko'rsatilmoqda.",
        data: {
          userCount,
          adminCount,
          allAdmins, 
        },
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Statistika olinmadi.",
        error: error.message,
      });
    }
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

  static verifyToken = asyncHandler(async (req, res) => {
    const user = req.body.user; // Middleware orqali kelgan foydalanuvchi

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        valid: false,
        message: "Token yaroqsiz yoki foydalanuvchi topilmadi!",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      valid: true,
    });
  });
}

/// bu otilgan signup la auftikatsiya deyladi
