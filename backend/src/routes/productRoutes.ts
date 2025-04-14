import express from "express";
import * as productController from "../controllers/productController";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", upload.single("image"), productController.createProduct);
router.patch("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
