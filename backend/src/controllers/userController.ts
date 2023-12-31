import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { parsePaginationParams } from "../utils/pagination";
import { QueryParams } from "../utils/params";
import { userSchema } from "../utils/validation";
import { verifyToken } from "../auth/auth";
import { encryptPswd } from "../utils/encrypt";

class UserController {
  private prisma: PrismaClient;
  private router: Router;

  constructor(router: Router) {
    this.prisma = new PrismaClient();
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route("/").get(this.getUsers).post(this.createUser);

    this.router
      .route("/:id")
      .get(verifyToken, this.getUser)
      .patch(verifyToken, this.updateUser)
      .delete(verifyToken, this.deleteUser);

    this.router.route("/:id/stories").get(verifyToken, this.getUserStories);

    this.router.route("/:id/stories").get(verifyToken, this.getUserStories);
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
        createdStories: true,
        writtenStories: true,
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
    newUser.password = await encryptPswd(newUser.password);
    const user = await this.prisma.user.create({ data: newUser });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const userId = this.validateAndParseId(req.params.id);
    await this.ensureUserExists(userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        createdStories: true,
        writtenStories: true,
        password: false,
      },
    });

    res.json(user);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = this.validateAndParseId(req.params.id);
    await this.ensureUserExists(userId);

    const { error, value: updatedUserData } = userSchema.validate(req.body);
    if (error) {
      throw new AppError("UserSchema Validation error", 400);
    }

    if (updatedUserData.password) {
      updatedUserData.password = await encryptPswd(updatedUserData.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updatedUserData,
    });
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = this.validateAndParseId(req.params.id);
    await this.ensureUserExists(userId);

    await this.prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  };

  getUserStories = async (req: Request, res: Response): Promise<void> => {
    const userId = this.validateAndParseId(req.params.id);
    await this.ensureUserExists(userId);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("User not found", 403);
    }

    const createdStories = await this.prisma.story.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        images: true,
      },
    });

    const writtenStories = await this.prisma.story.findMany({
      where: {
        writerId: userId,
      },
      include: {
        images: true,
      },
    });

    res.json({
      createdStories,
      writtenStories,
    });
  };

  private validateAndParseId(id: string): number {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new AppError("Invalid ID", 400);
    }
    return parsedId;
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new AppError("User not found", 404);
    }
  }
}

export default UserController;
