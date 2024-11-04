import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '../../middleware/asynnc-handler.middleware.js'

export const uploadFile = asyncHandler(async (req, res,) => {
    const uplodadFile = req.file
    console.log(uplodadFile);
    

    res.status(StatusCodes.OK).json({success: true, file_path: ''})
})