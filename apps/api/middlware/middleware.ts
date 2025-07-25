import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization!;

  try {
    const decoded = jwt.verify(header, process.env.JWT_SECRET!);

    req.userId = decoded.sub as string;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token",
    });
  }
};
