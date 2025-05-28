import { Router } from "express";
import auth from "../midelware/auth.js";
import uploadImageController from "../controllers/uploadImage.controller.js";
import upload from "../midelware/multer.js";

const uploadRouter = Router()

uploadRouter.post('/upload',auth,upload.single('image'),uploadImageController)

export default uploadRouter