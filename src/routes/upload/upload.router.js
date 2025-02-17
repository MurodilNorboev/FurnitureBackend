import { Router } from "express";
import { uploadFile } from "../../controllers/upload/upload.controller.js";
import { UploadMulter } from "../../utils/multer.js";

export const UploadRouter = Router();

UploadRouter.post(
  "/",
  UploadMulter.fields([
    { name: "image", maxCount: 10 },
    { name: "image1", maxCount: 10 },
    { name: "image2", maxCount: 10 },
    { name: "image3", maxCount: 10 },
    { name: "image4", maxCount: 10 },
    { name: "checkImg", maxCount: 10 },
  ]),
  uploadFile
);
