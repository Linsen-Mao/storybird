import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../err/errorHandler";
import { handleAuthError } from "../err/authErr";
import { comparePswd } from "../utils/encrypt";
require("dotenv").config();

const prisma = new PrismaClient();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
  throw new AppError("JWT_SECRET_KEY must be defined", 500);
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;
    if (decoded && decoded.id) {
      req.userId = decoded.id;
      next();
    } else {
      next(new AppError("token is invalid", 403));
    }
  } catch (error) {
    handleAuthError(error, next);
  }
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new AppError("Authentication failed.", 404);
  }

  const isPasswordValid: boolean = await comparePswd(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Authentication failed.", 401);
  }

  const tokenParams: object = {
    id: user.id,
    name: user.username,
  };

  const signOptions: SignOptions = {
    expiresIn: process.env.JWT_EXPIRATION || "1d",
  };
  return jwt.sign(tokenParams, JWT_SECRET_KEY, signOptions);
};
