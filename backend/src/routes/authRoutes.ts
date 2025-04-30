import express from "express";
import * as authController from "../controllers/authController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @route POST /api/v1/auth/signup
 * @desc Sign up a new user
 */
// #swagger.tags = ['Auth']
// #swagger.description = 'Register a new user'
// #swagger.parameters['body'] = {
//     in: 'body',
//     description: 'Signup credentials',
//     required: true,
//     schema: { email: 'user@example.com', password: '123456' }
// }
// #swagger.responses[201] = { description: 'User created successfully' }
router.post("/signup", authController.signup);

/**
 * @route POST /api/v1/auth/login
 * @desc Log in a user
 */
// #swagger.tags = ['Auth']
// #swagger.description = 'Log in a user'
// #swagger.parameters['body'] = {
//     in: 'body',
//     description: 'Login credentials',
//     required: true,
//     schema: { email: 'user@example.com', password: '123456' }
// }
// #swagger.responses[200] = { description: 'Login successful' }
router.post("/login", authController.login);

/**
 * @route POST /api/v1/auth/logout
 * @desc Log out the current user
 */
// #swagger.tags = ['Auth']
// #swagger.description = 'Log out a user'
// #swagger.responses[200] = { description: 'Logout successful' }
router.post("/logout", authController.logout);

/**
 * @route GET /api/v1/auth/authCheck
 * @desc Check if user is authenticated
 */
// #swagger.tags = ['Auth']
// #swagger.description = 'Check authentication status'
// #swagger.responses[200] = { description: 'User is authenticated' }
// #swagger.responses[401] = { description: 'Unauthorized' }
router.get("/authCheck", protectRoute, authController.authCheck);

export default router;
