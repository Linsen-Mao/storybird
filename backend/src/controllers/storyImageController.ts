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
      .route("/")
      .get(verifyToken, this.getStoryImages)
      .post(verifyToken, this.addImageToStory);

    this.router
      .route("/:imageID")
      .patch(verifyToken, this.updateImage)
      .delete(verifyToken, this.deleteCaptiion);

    this.router
      .route("/:imageID/captions")
      .post(verifyToken, this.addCaptionToImage)
      .put(verifyToken, this.updateImageCaption);
  }

  getStoryImages = async (req: Request, res: Response): Promise<void> => {
    // const { storyID } = req.params;
    const { storyID } = req.body;

    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    const images = await this.prisma.storyImage.findMany({
      where: { storyId: parsedStoryId },
      select: {
        id: true,
        imageFile: true,
        caption: true,
        writer: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    if (!images || images.length === 0) {
      throw new AppError("No images found for the story", 404);
    }

    res.json({ images });
  };

  addImageToStory = async (req: Request, res: Response): Promise<void> => {
    // const { storyID } = req.params;
    const { storyID, imageFile, order } = req.body;

    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        creatorId: true,
      },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    if (req.userId !== story.creatorId) {
      throw new AppError("Unauthorized to add image to this story", 403);
    }

    const newImage = await this.prisma.storyImage.create({
      data: {
        storyId: parsedStoryId,
        imageFile,
        order,
        caption: "",
      },
    });

    res
      .status(201)
      .json({ message: "Image added to the story", image: newImage });
  };

  addCaptionToImage = async (req: Request, res: Response): Promise<void> => {
    const { imageID } = req.params;
    const { storyID, caption } = req.body;

    // Validate the caption input
    if (!caption) {
      throw new AppError("Caption is required", 400);
    }

    // Ensure the storyID and imageID are valid numbers
    const parsedStoryId = parseInt(storyID);
    const parsedImageId = parseInt(imageID);
    if (isNaN(parsedStoryId) || isNaN(parsedImageId)) {
      throw new AppError("Invalid story or image ID", 400);
    }

    // Fetch the story to check its current writerId
    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        writerId: true,
      },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // If there's no writer, or the writer matches the current user, proceed
    if (!story.writerId || story.writerId === req.userId) {
      // Update the writerId for the story if it's not already set
      if (!story.writerId) {
        await this.prisma.story.update({
          where: { id: parsedStoryId },
          data: { writerId: req.userId },
        });
      }

      // Fetch the image to check its current writerId
      const image = await this.prisma.storyImage.findUnique({
        where: { id: parsedImageId },
      });

      // If the image doesn't exist or doesn't belong to the story, throw an error
      if (!image || image.storyId !== parsedStoryId) {
        throw new AppError(
          "Image not found or does not belong to the story",
          404
        );
      }

      // If there's no writer for the image, or the writer matches the current user, proceed
      if (!image.writerId || image.writerId === req.userId) {
        // Update the caption and writerId for the image
        const updatedImage = await this.prisma.storyImage.update({
          where: { id: parsedImageId },
          data: {
            caption,
            writerId: req.userId,
          },
        });

        res.status(200).json({
          message: "Caption added successfully",
          image: updatedImage,
        });
      } else {
        throw new AppError("Unauthorized to add caption to this image", 403);
      }
    } else {
      throw new AppError("Unauthorized to add caption to this image", 403);
    }
  };

  updateImage = async (req: Request, res: Response): Promise<void> => {
    // const { storyID, imageID } = req.params;
    const { imageID } = req.params;
    const { storyID, ...updateData } = req.body;
    console.log(req.body);
    const parsedStoryId = parseInt(storyID);
    const parsedImageId = parseInt(imageID);
    if (isNaN(parsedStoryId) || isNaN(parsedImageId)) {
      throw new AppError("Invalid story or image ID", 400);
    }

    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        creatorId: true,
      },
    });
    if (!story) {
      throw new AppError("Story not found", 404);
    }

    if (req.userId !== story.creatorId) {
      throw new AppError("Unauthorized to update this image", 403);
    }

    const imageExists = await this.prisma.storyImage.findFirst({
      where: {
        id: parsedImageId,
        storyId: parsedStoryId,
      },
    });
    if (!imageExists) {
      throw new AppError(
        "Image not found or does not belong to the story",
        404
      );
    }

    const updatedImage = await this.prisma.storyImage.update({
      where: { id: parsedImageId },
      data: updateData,
    });

    res.status(200).json({
      message: "Image updated successfully",
      image: updatedImage,
    });
  };

  updateImageCaption = async (req: Request, res: Response): Promise<void> => {
    // const { storyID, imageID } = req.params;
    const { imageID } = req.params;
    // const { caption } = req.body; /
    const { storyID, caption } = req.body;
    // 验证输入
    if (!caption) {
      throw new AppError("Caption is required", 400);
    }

    const parsedStoryId = parseInt(storyID);
    const parsedImageId = parseInt(imageID);
    if (isNaN(parsedStoryId) || isNaN(parsedImageId)) {
      throw new AppError("Invalid story or image ID", 400);
    }

    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        writerId: true,
      },
    });
    if (!story) {
      throw new AppError("Story not found", 404);
    }

    const imageExists = await this.prisma.storyImage.findFirst({
      where: {
        id: parsedImageId,
        storyId: parsedStoryId,
      },
    });
    if (!imageExists) {
      throw new AppError(
        "Image not found or does not belong to the story",
        404
      );
    }

    const updatedImage = await this.prisma.storyImage.update({
      where: { id: parsedImageId },
      data: { caption },
    });

    res.status(200).json({
      message: "Caption updated successfully",
      image: updatedImage,
    });
  };

  deleteCaptiion = async (req: Request, res: Response): Promise<void> => {
    const { storyID, imageID } = req.params;

    const story = await this.prisma.story.findUnique({
      where: { id: parseInt(storyID) },
      select: {
        writerId: true,
      },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    if (req.userId !== story.writerId) {
      throw new AppError("Unauthorized to delete this image's caption", 403);
    }

    const imageExists = await this.prisma.storyImage.findUnique({
      where: {
        id: parseInt(imageID),
        storyId: parseInt(storyID),
      },
    });

    if (!imageExists) {
      throw new AppError(
        "Image not found or does not belong to the story",
        404
      );
    }

    await this.prisma.storyImage.update({
      where: { id: parseInt(imageID) },
      data: {
        caption: null,
      },
    });

    res.status(200).json({
      message: "Caption deleted successfully",
    });
  };
}

export default StoryImageController;
