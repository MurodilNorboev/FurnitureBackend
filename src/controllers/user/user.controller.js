import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { User } from "../../models/user/user.model.js";
import { HttpException } from "../../utils/http.exception.js";
import bcrypt from 'bcrypt';

export class UserController {
    static signUp = asyncHandler(async (req, res) => {
        const {full_name, phone_number, email, password} = req.body

        await User.create({full_name, phone_number, email, password})

        res.status(StatusCodes.CREATED).json({success: true,msg: "Successfully sign up!"});
    });

    static login = asyncHandler(async(req, res) => {
        const {email, password} = req.body

        const user = await User.findOne({email: email})
        if(!user) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "Invalid login credentials!")
        }
        if (user.password !== password) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "Invalid login credentials!")
        }

        res.status(StatusCodes.OK).json({success: true, user})
    })

}