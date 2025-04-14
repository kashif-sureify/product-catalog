import express from "express";
import * as authController from "../controllers/authController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/authCheck", protectRoute, authController.authCheck);

export default router;
