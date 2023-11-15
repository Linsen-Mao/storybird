import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../err/errorHandler";
import { handleAuthError } from "../err/authErr";
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
  throw new AppError("JWT_SECRET_KEY must be defined", 500);
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;
    if (decoded) {
      next();
    } else {
      next(new AppError("token is invalid", 403));
    }
  } catch (error) {
    handleAuthError(error, next);
  }
};
