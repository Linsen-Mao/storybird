import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { parsePaginationParams } from "../utils/pagination";
import { userSchema } from "../utils/validation";
import { QueryParams } from "../utils/queryParams";
import { verifyAdmin, verifyAdminAndGuard } from "../auth/auth";

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
      .get(verifyAdminAndGuard, this.getUsers)
      .post(verifyAdmin, this.createUser);

    this.router
      .route("/:id")
      .get(verifyAdminAndGuard, this.getUserById)
      .patch(verifyAdmin, this.updateUser)
      .delete(verifyAdmin, this.deleteUser);
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    const { offset, limit } = req.query as QueryParams;
    const { skipValue, takeValue } = parsePaginationParams(offset, limit);

    // don't return password
    const users = await this.prisma.user.findMany({
      skip: skipValue,
      take: takeValue,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        licensePlateNumber: true,
        role: true,
        status: true,
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
    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("User ID is required", 400);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value: updateData } = userSchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    if (!id) {
      throw new AppError("User ID is required for update", 400);
    }

    await this.prisma.user.update({ where: { id }, data: updateData });
    res.status(200).json({ message: "User updated successfully" });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("User ID is required for deletion", 400);
    }

    await this.prisma.user.delete({ where: { id } });
    res.status(204).send();
  };
}

export default UserController;
