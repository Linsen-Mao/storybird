import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { verifyToken } from "../auth/auth";

class CategoryController {
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
      .post(verifyToken, this.createCategory)
      .get(this.getCategories);
  }

  getCategories = async (req: Request, res: Response): Promise<void> => {
    const categories = await this.prisma.category.findMany();

    res.status(200).json({ categories });
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body;

    if (!name) {
      throw new AppError("Name is required for the category", 400);
    }

    const newCategory = await this.prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  };
}

export default CategoryController;
