import { Router } from "express";
import { uploadFile } from "../../controllers/upload/upload.controller.js";
import { UploadMulter } from "../../utils/multer.js";

export const UploadRouter = Router();

UploadRouter.post(
  '/',
  UploadMulter.fields([
    { name: 'image', maxCount: 2 },
    { name: 'image1', maxCount: 2 },
    { name: 'image2', maxCount: 2 },
    { name: 'image3', maxCount: 2 },
    { name: 'image4', maxCount: 2 },
    { name: 'image5', maxCount: 2 },
    { name: 'image6', maxCount: 2 },
    { name: 'image7', maxCount: 2 },
  ]),
  uploadFile
);
