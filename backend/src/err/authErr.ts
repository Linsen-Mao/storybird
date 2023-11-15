import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../err/errorHandler";

export const handleAuthError = (error: unknown, next: NextFunction) => {
  if (error instanceof jwt.TokenExpiredError) {
    next(new AppError(`Token expired: ${error.message}`, 401));
  } else if (error instanceof jwt.JsonWebTokenError) {
    next(new AppError(`JWT error: ${error.message}`, 401));
  } else if (error instanceof AppError) {
    next(error);
  } else {
    next(
      new AppError(
        "An unexpected error occurred while verifying the token",
        500
      )
    );
  }
};
