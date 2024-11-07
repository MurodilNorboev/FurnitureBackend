import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '../../middleware/asynnc-handler.middleware.js'
import { sendFile } from '../../utils/s3.js'
import { v4 } from 'uuid'
import path from 'path'

export const uploadFile = asyncHandler(async (req, res,) => {
    const uplodadFile = req.file

    const key = v4() + path.extname(uplodadFile.originalname);
    const file_path = await sendFile(uplodadFile.buffer, key);
    

    res.status(StatusCodes.OK).json({success: true, file_path})
})