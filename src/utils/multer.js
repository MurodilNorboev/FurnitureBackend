import multer from 'multer';
import path from 'path';
import { HttpException } from './http.exception.js';
import { StatusCodes } from 'http-status-codes';

const CheckFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|svg|webp|avif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, 'Only images are allowed'));
};


export const UploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => CheckFileType(file, cb),
  
});

export const VideoMulter = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const videoPath = path.join(getDirname(), 'uploads', 'videos'); // Video papkasini olish
            createUploadDirs(videoPath); // Papkalarni yaratish
            cb(null, videoPath); // Video fayllarni saqlash joyi
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 1024 * 1024 * 200 }, // Video o'lchami
    fileFilter: (req, file, cb) => {
        CheckFileType(file, cb); // Fayl turini tekshirish
    }
});

const createUploadDirs = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

