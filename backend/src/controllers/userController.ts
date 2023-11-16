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
      .route("/:id")
      .get(verifyToken, this.getUser)
      .patch(verifyToken, this.updateUser)
      .delete(verifyToken, this.deleteUser);

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

    const user = await this.prisma.user.create({ data: newUser });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // 使用 id 而不是 email

    const parsedUserId = parseInt(id);
    if (isNaN(parsedUserId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: parsedUserId }, // 根据 id 查询
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

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // 使用 id 而不是 email
    const { error, value: updateData } = userSchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    const parsedUserId = parseInt(id);
    if (isNaN(parsedUserId)) {
      throw new AppError("Invalid user ID", 400);
    }

    await this.prisma.user.update({
      where: { id: parsedUserId }, // 根据 id 更新
      data: updateData,
    });
    res.status(200).json({ message: "User updated successfully" });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // 使用 id 而不是 email

    const parsedUserId = parseInt(id);
    if (isNaN(parsedUserId)) {
      throw new AppError("Invalid user ID", 400);
    }

    await this.prisma.user.delete({ where: { id: parsedUserId } }); // 根据 id 删除
    res.status(204).send();
  };

  getUserStories = async (req: Request, res: Response): Promise<void> => {
    const { userID } = req.params;

    // 验证 userID 是否有效，这里假设 userID 是一个整数
    const parsedUserId = parseInt(userID);
    if (isNaN(parsedUserId)) {
      throw new AppError("Invalid user ID", 400);
    }

    // 获取该用户作为 creator 创建的所有故事
    const createdStories = await this.prisma.story.findMany({
      where: {
        creatorId: parsedUserId,
      },
      include: {
        images: true, // 如果您还想包含相关的图片
      },
    });

    // 获取该用户作为 writer 参与的所有故事
    const writtenStories = await this.prisma.story.findMany({
      where: {
        writerId: parsedUserId,
      },
      include: {
        images: true, // 如果您还想包含相关的图片
      },
    });

    // 返回结果
    res.json({
      createdStories,
      writtenStories,
    });
  };
}

export default UserController;
