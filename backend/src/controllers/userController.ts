import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { parsePaginationParams } from "../utils/pagination";
import { QueryParams } from "../utils/params";
import { userSchema } from "../utils/validation";
import { verifyToken } from "../auth/auth";

class UserController {
  private prisma: PrismaClient;
  private router: Router;

  constructor(router: Router) {
    this.prisma = new PrismaClient();
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router
      .route("/")
      .get(verifyToken, this.getUsers)
      .post(verifyToken, this.createUser);

    this.router
      .route("/:email")
      .get(verifyToken, this.getUserByEmail)
      .patch(verifyToken, this.updateUserByEmail)
      .delete(verifyToken, this.deleteUserByEmail);
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    const { offset, limit } = req.query as QueryParams;
    const { skipValue, takeValue } = parsePaginationParams(offset, limit);

    const users = await this.prisma.user.findMany({
      skip: skipValue,
      take: takeValue,
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        stories: true,
        password: false,
      },
    });
    res.json({ users });
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { error, value: newUser } = userSchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    const user = await this.prisma.user.create({ data: newUser });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  };

  getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;

    if (!email) {
      throw new AppError("User email is required", 400);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        stories: true,
        password: false,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  };

  updateUserByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;
    const { error, value: updateData } = userSchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    if (!email) {
      throw new AppError("User email is required for update", 400);
    }

    await this.prisma.user.update({
      where: { email: email },
      data: updateData,
    });
    res.status(200).json({ message: "User updated successfully" });
  };

  deleteUserByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;

    if (!email) {
      throw new AppError("User email is required for deletion", 400);
    }

    await this.prisma.user.delete({ where: { email: email } });
    res.status(204).send();
  };
}

export default UserController;
