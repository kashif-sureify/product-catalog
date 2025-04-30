import express from "express";
import upload from "../middlewares/upload";
import uploadController from "../controllers/uploadController";

const router = express.Router();

router.post("/", upload.single("image"), uploadController.uploadImage);
router.patch("/", upload.single("image"), uploadController.uploadImage);


export default router;
