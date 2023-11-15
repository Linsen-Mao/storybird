import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { verifyToken } from "../auth/auth";

class StoryImageController {
  private prisma: PrismaClient;
  private router: Router;

  constructor(router: Router) {
    this.prisma = new PrismaClient();
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router
      .route("/:storyID/images")
      .get(verifyToken, this.getStoryImages)
      .post(verifyToken, this.addImageToStory);
  }

  getStoryImages = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

    const images = await this.prisma.storyImage.findMany({
      where: { storyId: parseInt(storyID) },
      select: {
        imageFile: true,
        caption: true,
      },
    });

    if (!images || images.length === 0) {
      throw new AppError("No images found for the story", 404);
    }

    res.json({ images });
  };

  addImageToStory = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;
    const { imageFile, order } = req.body;

    // 检查故事是否存在
    const story = await this.prisma.story.findUnique({
      where: { id: parseInt(storyID) },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    const newImage = await this.prisma.storyImage.create({
      data: {
        storyId: parseInt(storyID),
        imageFile,
        order,
      },
    });

    res
      .status(201)
      .json({ message: "Image added to the story", image: newImage });
  };
}

export default StoryImageController;
