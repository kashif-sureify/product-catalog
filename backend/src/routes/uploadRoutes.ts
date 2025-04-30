import express from "express";
import upload from "../middlewares/upload";
import uploadController from "../controllers/uploadController";

const router = express.Router();

/**
 * @route POST /api/upload
 * @desc Upload a new image
 */
// #swagger.tags = ['Upload']
// #swagger.description = 'Upload a new image'
// #swagger.consumes = ['multipart/form-data']
// #swagger.parameters['image'] = {
//   in: 'formData',
//   type: 'file',
//   required: true,
//   description: 'Image file to upload'
// }
// #swagger.responses[200] = { description: 'Image uploaded successfully' }
router.post("/", upload.single("image"), uploadController.uploadImage);

/**
 * @route PATCH /api/upload
 * @desc Replace an existing image
 */
// #swagger.tags = ['Upload']
// #swagger.description = 'Replace an existing image'
// #swagger.consumes = ['multipart/form-data']
// #swagger.parameters['image'] = {
//   in: 'formData',
//   type: 'file',
//   required: true,
//   description: 'New image file'
// }
// #swagger.responses[200] = { description: 'Image replaced successfully' }
router.patch("/", upload.single("image"), uploadController.uploadImage);

export default router;
