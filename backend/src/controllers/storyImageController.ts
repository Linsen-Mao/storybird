import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { verifyToken } from "../auth/auth";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

class StoryImageController {
  private prisma: PrismaClient;
  private router: Router;

  constructor(router: Router) {
    this.prisma = new PrismaClient();
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route("/").get(verifyToken, this.getStoryImages);
    this.router.post(
      "/",
      verifyToken,
      upload.single("imageFile"),
      this.addImageToStory
    );

    this.router
      .route("/:imageID")
      .patch(verifyToken, this.updateImage)
      .delete(verifyToken, this.deleteImage);

    this.router
      .route("/:imageID/captions")
      .post(verifyToken, this.addCaptionToImage)
      .put(verifyToken, this.updateImageCaption)
      .delete(verifyToken, this.deleteCaptiion);
  }

  getStoryImages = async (req: Request, res: Response): Promise<void> => {
    const { storyID } = req.params;

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
    const { storyID } = req.params;
    const { order } = req.body;
    const imageFile = req.file;

    const parsedOrder = parseInt(order);

    if (isNaN(parsedOrder)) {
      throw new AppError("Invalid order", 400);
    }

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

    if (!imageFile) {
      throw new AppError("No image file provided", 400);
    }

    const newImage = await this.prisma.storyImage.create({
      data: {
        storyId: parsedStoryId,
        imageFile: imageFile.path,
        order: parsedOrder,
        caption: "",
      },
    });

    res
      .status(201)
      .json({ message: "Image added to the story", image: newImage });
  };

  addCaptionToImage = async (req: Request, res: Response): Promise<void> => {
    const { storyID, imageID } = req.params;
    const { caption } = req.body;

    if (!caption) {
      throw new AppError("Caption is required", 400);
    }

    if (typeof req.userId !== "number") {
      throw new AppError("User ID is undefined", 400);
    }
    await this.validateStoryAndImage(storyID, imageID, req.userId);

    const updatedImage = await this.prisma.storyImage.update({
      where: { id: parseInt(imageID) },
      data: { caption },
    });

    res.status(200).json({
      message: "Caption added successfully",
      image: updatedImage,
    });
  };

  updateImage = async (req: Request, res: Response): Promise<void> => {
    const { storyID, imageID } = req.params;
    const { ...updateData } = req.body;
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
    const { storyID, imageID } = req.params;
    const { caption } = req.body;

    if (!caption) {
      throw new AppError("Caption is required", 400);
    }

    if (typeof req.userId !== "number") {
      throw new AppError("User ID is undefined", 400);
    }
    await this.validateStoryAndImage(storyID, imageID, req.userId);

    const updatedImage = await this.prisma.storyImage.update({
      where: { id: parseInt(imageID) },
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

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    const { storyID, imageID } = req.params;

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
      throw new AppError("Unauthorized to delete this image", 403);
    }

    const imageExists = await this.prisma.storyImage.findUnique({
      where: { id: parsedImageId },
    });

    if (!imageExists) {
      throw new AppError("Image not found", 404);
    }

    await this.prisma.storyImage.delete({
      where: { id: parsedImageId },
    });

    res.status(200).json({ message: "Image deleted successfully" });
  };

  private async validateStoryAndImage(
    storyID: string,
    imageID: string,
    userId: number
  ): Promise<void> {
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

    if (!story.writerId) {
      await this.prisma.story.update({
        where: { id: parsedStoryId },
        data: { writerId: userId },
      });

      await this.prisma.storyImage.updateMany({
        where: { storyId: parsedStoryId },
        data: { writerId: userId },
      });
    }

    if (story.writerId !== userId) {
      throw new AppError("Unauthorized to modify this story", 403);
    }

    const imageExists = await this.prisma.storyImage.findUnique({
      where: {
        id: parsedImageId,
        storyId: parsedStoryId,
        writerId: userId,
      },
    });

    if (!imageExists) {
      throw new AppError(
        "Image not found or does not belong to the story",
        404
      );
    }
  }
}

export default StoryImageController;
