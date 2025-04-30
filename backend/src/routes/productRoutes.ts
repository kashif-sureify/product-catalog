import express from "express";
import * as productController from "../controllers/productController";
import upload from "../middlewares/upload";

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products
 */
// #swagger.tags = ['Products']
// #swagger.description = 'Get all products'
// #swagger.responses[200] = { description: 'List of products' }
router.get("/", productController.getProducts);

/**
 * @route GET /api/products/{id}
 * @desc Get a single product by ID
 */
// #swagger.tags = ['Products']
// #swagger.description = 'Get a product by ID'
// #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Product found' }
// #swagger.responses[404] = { description: 'Product not found' }
router.get("/:id", productController.getProduct);

/**
 * @route POST /api/products
 * @desc Create a new product
 */
// #swagger.tags = ['Products']
// #swagger.description = 'Create a new product'
// #swagger.consumes = ['multipart/form-data']
// #swagger.parameters['image'] = { in: 'formData', type: 'file', required: false }
// #swagger.parameters['body'] = {
//     in: 'formData',
//     description: 'Product data',
//     required: true,
//     schema: {
//         name: 'Product Name',
//         price: 99.99,
//         description: 'A product description'
//     }
// }
// #swagger.responses[201] = { description: 'Product created successfully' }
router.post("/", upload.single("image"), productController.createProduct);

/**
 * @route PATCH /api/products/{id}
 * @desc Update a product
 */
// #swagger.tags = ['Products']
// #swagger.description = 'Update a product'
// #swagger.consumes = ['multipart/form-data']
// #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
// #swagger.parameters['image'] = { in: 'formData', type: 'file', required: false }
// #swagger.parameters['body'] = {
//     in: 'formData',
//     description: 'Updated product data',
//     required: true,
//     schema: {
//         name: 'Updated Name',
//         price: 79.99,
//         description: 'Updated description'
//     }
// }
// #swagger.responses[200] = { description: 'Product updated successfully' }
// #swagger.responses[404] = { description: 'Product not found' }
router.patch("/:id", upload.single("image"), productController.updateProduct);

/**
 * @route DELETE /api/products/{id}
 * @desc Delete a product
 */
// #swagger.tags = ['Products']
// #swagger.description = 'Delete a product'
// #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Product deleted successfully' }
// #swagger.responses[404] = { description: 'Product not found' }
router.delete("/:id", productController.deleteProduct);

export default router;
