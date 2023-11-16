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
      .route("/:imageID") // 注意：父路由已经包含 /stories/:storyID/images
      .patch(verifyToken, this.updateImage)
      .delete(verifyToken, this.deleteCaptiion);

    this.router
      .route("/:imageID/captions")
      .post(verifyToken, this.addCaptionToImage) // 新路由
      .put(verifyToken, this.updateImageCaption);
  }

  getStoryImages = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

    // Ensure the storyID is a valid number
    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    const images = await this.prisma.storyImage.findMany({
      where: { storyId: parsedStoryId },
      select: {
        imageFile: true,
        caption: true,
        writer: {
          // Include details about the writer of the caption
          select: {
            id: true,
            username: true,
            email: true, // Include email if necessary, or remove it if it's sensitive
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
    const { storyID } = req.params;
    const { imageFile, order } = req.body;

    // Ensure the storyID is a valid number
    const parsedStoryId = parseInt(storyID);
    if (isNaN(parsedStoryId)) {
      throw new AppError("Invalid story ID", 400);
    }

    // Check if the story exists and fetch the creatorId
    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        creatorId: true,
      },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the creator of the story
    // Assuming req.userId holds the authenticated user's ID
    if (req.userId !== story.creatorId) {
      throw new AppError("Unauthorized to add image to this story", 403);
    }

    // Create a new image with an empty caption
    const newImage = await this.prisma.storyImage.create({
      data: {
        storyId: parsedStoryId,
        imageFile,
        order,
        caption: "", // Initial caption is empty
      },
    });

    res
      .status(201)
      .json({ message: "Image added to the story", image: newImage });
  };

  addCaptionToImage = async (req: Request, res: Response): Promise<void> => {
    const { storyID, imageID } = req.params;
    const { caption } = req.body;

    // 验证输入
    if (!caption) {
      throw new AppError("Caption is required", 400);
    }

    // Ensure the storyID and imageID are valid numbers
    const parsedStoryId = parseInt(storyID);
    const parsedImageId = parseInt(imageID);
    if (isNaN(parsedStoryId) || isNaN(parsedImageId)) {
      throw new AppError("Invalid story or image ID", 400);
    }

    // 检查故事是否存在，并获取其 writerId
    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        writerId: true,
      },
    });
    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the writer of the story
    if (req.userId !== story.writerId) {
      throw new AppError("Unauthorized to add caption to this image", 403);
    }

    // Check if the image exists and belongs to the story
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

    // 更新图片说明
    const updatedImage = await this.prisma.storyImage.update({
      where: { id: parsedImageId },
      data: { caption },
    });

    res.status(200).json({
      message: "Caption added successfully",
      image: updatedImage,
    });
  };

  updateImage = async (req: Request, res: Response): Promise<void> => {
    const { storyID, imageID } = req.params;
    const updateData = req.body; // 包含更新信息的请求体

    // Ensure the storyID and imageID are valid numbers
    const parsedStoryId = parseInt(storyID);
    const parsedImageId = parseInt(imageID);
    if (isNaN(parsedStoryId) || isNaN(parsedImageId)) {
      throw new AppError("Invalid story or image ID", 400);
    }

    // 检查故事是否存在并获取其 creatorId
    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        creatorId: true,
      },
    });
    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the creator of the story
    if (req.userId !== story.creatorId) {
      throw new AppError("Unauthorized to update this image", 403);
    }

    // 检查图片是否属于该故事
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

    // 更新图片信息
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
    const { storyID, imageID } = req.params;
    const { caption } = req.body; // 新的说明文字

    // 验证输入
    if (!caption) {
      throw new AppError("Caption is required", 400);
    }

    // Ensure the storyID and imageID are valid numbers
    const parsedStoryId = parseInt(storyID);
    const parsedImageId = parseInt(imageID);
    if (isNaN(parsedStoryId) || isNaN(parsedImageId)) {
      throw new AppError("Invalid story or image ID", 400);
    }

    // 检查故事是否存在并获取其 writerId
    const story = await this.prisma.story.findUnique({
      where: { id: parsedStoryId },
      select: {
        writerId: true,
      },
    });
    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the writer of the story
    if (req.userId !== story.writerId) {
      throw new AppError("Unauthorized to update this image's caption", 403);
    }

    // 检查图片是否存在并属于该故事
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

    // 更新图片说明
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

    // 检查故事是否存在并获取其 writerId
    const story = await this.prisma.story.findUnique({
      where: { id: parseInt(storyID) },
      select: {
        writerId: true,
      },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    // Check if the authenticated user is the writer of the story
    if (req.userId !== story.writerId) {
      throw new AppError("Unauthorized to delete this image's caption", 403);
    }

    // 检查图片是否存在并属于该故事
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

    // 执行删除操作
    await this.prisma.storyImage.update({
      where: { id: parseInt(imageID) },
      data: {
        caption: null, // Set the caption to null to delete it
      },
    });

    res.status(200).json({
      message: "Caption deleted successfully",
    });
  };
}

export default StoryImageController;
