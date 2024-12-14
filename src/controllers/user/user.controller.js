import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { User } from "../../models/user/user.model.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";

export class UserController {

    static signUp = asyncHandler( async (req, res) => {
        const {
            full_name, 
            phone_number, 
            email, 
            password,
        } = req.body;

        const user = await User.findOne({ email })
        if(user) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED, 
                ReasonPhrases.UNAUTHORIZED, 
                "This email already used!"
            )
        }
        

        await User.create({
            full_name, 
            phone_number, 
            email, 
            password: await HashingHelper.generatePassword(password)}),

        res.status(StatusCodes.CREATED).json({success: true, msg: "Successfully sign up!"});
    });

    static login = asyncHandler( async (req, res) => {
        const {email, password} = req.body

        const user = await User.findOne({ email }).select("+password")
        if(!user) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED, 
                ReasonPhrases.UNAUTHORIZED, 
                "Invalid login credentials!")
        }
        if (!HashingHelper.comparePassword(password, user.password)) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED, 
                ReasonPhrases.UNAUTHORIZED, 
                "Invalid login credentials!")
        }

        const access_token = await JwtHelper.sign(user._id)

        res.status(StatusCodes.OK).json({success: true, access_token})
    });

    static getprofile = asyncHandler( async (req, res) => {
        const data = req.body.user; 
        if (!data) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Foydalanuvchi topilmadi",
            });
        }
        res.status(StatusCodes.OK).json({success: true, data })
    })

    ////
    static getUserCount = asyncHandler(async (req, res) => {
        const UserCount = await User.countDocuments(); // Umumiy foydalanuvchi soni
        const LoggedInUserCount = await User.countDocuments({ lastLogin: { $ne: null } }); // Faqat logindan o'tgan foydalanuvchilar
      
        res.status(StatusCodes.OK).json({
          success: true,
          UserCount,
          LoggedInUserCount, // Logindan o'tgan foydalanuvchi soni
        });
      });
      
    static getAllUsers = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        
        // Foydalanuvchilarni vaqti bilan tartiblash
        const users = await User.find({}, '-password')
                                .skip((page - 1) * limit)
                                .limit(Number(limit))
                                .sort({ createdAt: -1 }); // Yangi foydalanuvchilarni birinchi qilib tartiblash
                                
        const totalUsers = await User.countDocuments();
        const totalLoggedInUsers = await User.countDocuments({ lastLogin: { $ne: null } });
      
        res.status(StatusCodes.OK).json({
          success: true,
          users,
          totalUsers,
          totalLoggedInUsers, 
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: Number(page),
        });
    });  
}

/// bu otilgan signup la auftikatsiya deyladi

