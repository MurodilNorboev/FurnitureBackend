import multer from 'multer';
import path from 'path';
import { HttpException } from '../utils/http.exception.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

// image
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|png|jpg|svg|webp|avif|mp4|mkv|mov|wmv|mr3/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        ReasonPhrases.UNPROCESSABLE_ENTITY,
        "You can only upload image files (jpeg, png, jpg, svg, webp, avif) and the maximum size is 50MB."
      ),
      false
    );
  }
};
export const UploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); 
  },
});
