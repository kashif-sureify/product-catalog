import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: Omit<DecodedUser, "password">;
  }
}

interface DecodedUser extends JwtPayload {
  id: string;
  email: string;
  password?: string;
}

export const protectRoute = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      status: 401,
      success: false,
      message: "Not Authorized, No token !",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;

    if (decoded.password) {
      delete decoded.password;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      success: false,
      message: "Not Authorized, invalid token",
    });
  }
};
