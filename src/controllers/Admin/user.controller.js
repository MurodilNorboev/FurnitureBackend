import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";
import { FurUser } from "../../models/Admin/user.models.js";
import mongoose from "mongoose";


export class FurnitureUserController {

    static signUp = asyncHandler( async (req, res) => {
        const {
            full_name, 
            lastName,
            phone_number, 
            email, 
            password,
            address: { country, city, street, apartmant, zip_code },
            comment
        } = req.body;

        const user = await FurUser.findOne({ email })
        if(user) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED, 
                ReasonPhrases.UNAUTHORIZED, 
                "This email already used!"
            )
        }
        

        await FurUser.create({
            full_name, 
            lastName,
            phone_number, 
            email, 
            password: await HashingHelper.generatePassword(password),
            address: { country, city, street, apartmant, zip_code },
            comment,
        });
        res.status(StatusCodes.CREATED).json({success: true, msg: "Successfully sign up!"});
    })

    static login = asyncHandler( async (req, res) => {
        const {email, password} = req.body

        const user = await FurUser.findOne({ email }).select("+password")
        
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

    static getMe = asyncHandler(async (req, res) => {
        const user = req.body.user; 
        res.status(StatusCodes.OK).json({ success: true, data: user });
    });

    static updateUser = asyncHandler(async (req, res) => {
        const { full_name, lastName, email, phone_number, password, address: {
            country, city,street, apartmant,zip_code
        }, comment
    } = req.body;
    const { id } = req.params;

    const user = await FurUser.findByIdAndUpdate(id, {
        full_name, lastName, email, phone_number, password, address: {
            country, city,street, apartmant,zip_code
        }, comment
    }, { new: true });

    res.status(StatusCodes.OK).json({ success: true, user})
    });

    static deleteUser = asyncHandler(async (req, res) => {
        const { id } = req.params;  
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid ID format"})
        }
        
        const user = await FurUser.findByIdAndDelete(id); 
    
        if (!user) {
            return res.status(404).json({ success: false, msg: "User topilmadi!" })
        }
    
        res.status(200).json({ success: true, data: user, msg: "User muvaffaqiyatli o'chirildi"})
    });

    static getUserCount = asyncHandler(async (req, res) => {
        const { query } = req.query;
    
        const searchFilter = query
            ? {
                $or: [
                    { full_name: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" }},
                ]
            }
            : {};

        const UserCount = await FurUser.countDocuments(searchFilter);
    
        const LoggedInUserCount = await FurUser.countDocuments({
            ...searchFilter,
            lastLogin: { $ne: null }
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