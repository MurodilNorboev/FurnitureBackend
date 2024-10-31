import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { User } from "../../models/user/user.model.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";

export class UserController {

    static signUp = asyncHandler( async (req, res) => {
        const {full_name, phone_number, email, password} = req.body

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
            email, password: await HashingHelper.generatePassword(password)})

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
        if (HashingHelper.comparePassword(password, user.password)) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED, 
                ReasonPhrases.UNAUTHORIZED, 
                "Invalid login credentials!")
        }

        const access_token = JwtHelper.sign(user._id)

        res.status(StatusCodes.OK).json({success: true, access_token})
    });

    static getprofile = asyncHandler( async (req, res) => {})

}


