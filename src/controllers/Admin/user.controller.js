import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../middleware/asynnc-handler.middleware.js";
import { HttpException } from "../../utils/http.exception.js";
import { HashingHelper } from "../../utils/hashing.halper.js";
import { JwtHelper } from "../../utils/jwt.helper.js";
import { FurUser } from "../../models/FurnitureModel/furniuter.models.js";
import axios from "axios";

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
            address: { country, city, street,kocha, apartmant, zip_code },
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

    static location = asyncHandler( async (req, res) => {

              const countriesUrl = `https://us1.locationiq.com/v1/countries?key=pk.4f1260517ad6abfdc84df4fde8e0b4dd`;
              const countriesResponse = await axios.get(countriesUrl);
        
              const citiesUrl = `https://us1.locationiq.com/v1/cities?key=pk.4f1260517ad6abfdc84df4fde8e0b4dd`;
              const citiesResponse = await axios.get(citiesUrl);
        
              const streetsUrl = `https://us1.locationiq.com/v1/streets?key=pk.4f1260517ad6abfdc84df4fde8e0b4dd`;
              const streetsResponse = await axios.get(streetsUrl);
        
              res.status(200).json({
                success: true,
                data: {
                  countries: countriesResponse.data,
                  cities: citiesResponse.data,
                  streets: streetsResponse.data,
                },
              });
    })

}