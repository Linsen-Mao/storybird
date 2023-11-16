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
        creator: {
          // Change 'author' to 'creator' to reflect the new relationship
          select: {
            username: true,
            email: true,
            profile: true,
          },
        },
        writer: {
          // Add selection for 'writer'
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
    const { error, value: newStoryData } = storySchema.validate(req.body);
    if (error) {
      throw new AppError("Validation error: " + error.details[0].message, 400);
    }

    // Assuming the request body will include the creatorId and optionally the writerId
    // and that the user making the request is authenticated and their ID is available
    // as req.userId (set by a previous authentication middleware)

    if (!req.userId) {
      throw new AppError("Authentication required", 401);
    }

    // Add the authenticated user's ID as the creatorId
    const newStory = {
      ...newStoryData,
      creatorId: req.userId, // Set the creatorId to the authenticated user's ID
      // writerId can be set later when a writer is assigned
    };

    const story = await this.prisma.story.create({ data: newStory });
    res.status(201).json({ message: "Story created successfully", story });
  };

  getStoryById = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

    // Ensure the storyID is a valid number
    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      include: {
        creator: {
          // Include details about the creator
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
        writer: {
          // Include details about the writer if one is assigned
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
        images: true, // Include images related to the story
        category: {
          // Include details about the category
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
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

    // Ensure the storyID is a valid number
    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    // Fetch the story first to check if the authenticated user is the creator
    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the creator of the story
    // Assuming req.userId holds the authenticated user's ID
    if (req.userId !== story.creatorId) {
      throw new AppError("Unauthorized to update this story", 403);
    }

    // Proceed with the update if the user is authorized
    const updatedStory = await this.prisma.story.update({
      where: { id: parsedStoryId },
      data: updatedData,
    });

    res.json({ message: "Story updated successfully", story: updatedStory });
  };

  deleteStoryById = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

    // Ensure the storyID is a valid number
    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      include: { images: true }, // Include related images to check captions
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the creator of the story
    if (req.userId !== story.creatorId) {
      throw new AppError("Unauthorized to delete this story", 403);
    }

    // Check if all images have empty captions
    const allCaptionsEmpty = story.images.every(
      (image) => !image.caption || image.caption.trim() === ""
    );
    if (!allCaptionsEmpty) {
      throw new AppError(
        "Story cannot be deleted as not all images have empty captions",
        403
      );
    }

    // Proceed with the deletion if the user is authorized and all captions are empty
    await this.prisma.story.delete({ where: { id: story.id } });
    res.status(204).send();
  };
}

export default StoryController;
