import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  if (!(error instanceof AppError)) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        error = new AppError("User with given ID already exists", 400);
      } else if (error.code === "P2025") {
        error = new AppError("User not found", 404);
      } else {
        error = new AppError("Database error", 500);
      }
    } else {
      error = new AppError("An unexpected error occurred", 500);
    }
  }

  const appError = error as AppError;

  const errorResponse = {
    status: appError.status,
    message: appError.message,
  };

  res.status(appError.statusCode).json(errorResponse);
};
