import express from "express";
import multer from 'multer';
import { uploadFile } from "../controllers/uploadContoller.js";
const router = express.Router();
const upload = multer({ dest: "temp/" });
router.post("/", upload.single("file"), uploadFile);
export default router;