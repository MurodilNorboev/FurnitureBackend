import multer from 'multer';
import path from 'path';
import { HttpException } from '../utils/http.exception.js';
import { StatusCodes } from 'http-status-codes';

// images
const CheckFileType = ( file, cb) => {
    const fileTypes = /jpeg|png|svg|webp|avif|jpg/;
    const exname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype); 

    if (exname && mimeType) {
        cb(null, true);
    } else {
        cb(
            new HttpException(StatusCodes.UNPROCESSABLE_ENTITY,
                StatusCodes.UNPROCESSABLE_ENTITY,
                'You can upload only images up to 50 MB!'
            )
        );
    }
}
export const UploadMulter = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 50 },
    fileFilter: (req, file, cb) => {
        CheckFileType(file, cb); 
    }
});

// videos
const CheckFileTypeVideo = (file, cb) => {
    const fileTypes = /mp4|mkv|mov|wmv|mr3/;
    const exname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (exname && mimeType) {
        cb(null, true);
    } else {
        cb(
            new HttpException(StatusCodes.UNPROCESSABLE_ENTITY,
                StatusCodes.UNPROCESSABLE_ENTITY,
                'You can upload only video files up to 50 MB!'
            )
        )
    }
}
export const VideoMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 200, 
    },
    fileFilter: (req, file, cb) => {
        CheckFileTypeVideo(file, cb);
    }
});

