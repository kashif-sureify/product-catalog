import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";

import cors from "cors";
import { protectRoute } from "./middleware/authMiddleware";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use("/api/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api/upload", uploadRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/products", protectRoute, productRoutes);

export default app;
