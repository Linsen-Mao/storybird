import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { parsePaginationParams } from "../utils/pagination";
import { QueryParams } from "../utils/params";
import { verifyToken } from "../auth/auth";
import { storySchema } from "../utils/validation";

class StoryController {
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
      .get(verifyToken, this.getStories)
      .post(verifyToken, this.createStory);

    this.router
      .route("/:storyID")
      .get(verifyToken, this.getStoryById)
      .patch(verifyToken, this.updateStoryById)
      .delete(verifyToken, this.deleteStoryById);
  }

  getStories = async (req: Request, res: Response): Promise<void> => {
    const { offset, limit } = req.query as QueryParams;
    const { skipValue, takeValue } = parsePaginationParams(offset, limit);

    const stories = await this.prisma.story.findMany({
      skip: skipValue,
      take: takeValue,
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        author: {
          select: {
            username: true,
            email: true,
            profile: true,
          },
        },
        images: true,
        category: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });
    res.json({ stories });
  };

  createStory = async (req: Request, res: Response): Promise<void> => {
    const { error, value: newStory } = storySchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    const story = await this.prisma.story.create({ data: newStory });
    res.status(201).json({ message: "Story created successfully", story });
  };

  getStoryById = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

    const story = await this.prisma.story.findUnique({
      where: { id: parseInt(storyID) },
      include: {
        author: true,
        images: true,
        category: true,
      },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    res.json(story);
  };

  updateStoryById = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;
    const { error, value: updatedData } = storySchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    const updatedStory = await this.prisma.story.update({
      where: { id: parseInt(storyID) },
      data: updatedData,
    });

    if (!updatedStory) {
      throw new AppError("Story not found", 404);
    }

    res.json({ message: "Story updated successfully", story: updatedStory });
  };

  deleteStoryById = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

    const story = await this.prisma.story.findUnique({
      where: { id: parseInt(storyID) },
    });
    if (!story) {
      throw new AppError("Story not found", 404);
    }

    await this.prisma.story.delete({ where: { id: story.id } });
    res.status(204).send();
  };
}

export default StoryController;
