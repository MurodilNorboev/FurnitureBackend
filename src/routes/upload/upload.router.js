import { Router } from "express";
import { uploadFile } from "../../controllers/upload/upload.controller.js";
import { UploadMulter } from "../../utils/multer.js";

export const UploadRouter = Router();

UploadRouter.post(
  '/',
  UploadMulter.fields([
    { name: 'image', maxCount: 2 },
    { name: 'image1', maxCount: 2 },
  ]),
  uploadFile
);
