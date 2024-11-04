import { Router } from "express";
import { uploadFile } from "../../controllers/upload/upload.controller.js";
import { UploadMulter} from "../../utils/multer.js";

export const UploadRouter = Router()

UploadRouter.post("/file", UploadMulter.single("image"), uploadFile)