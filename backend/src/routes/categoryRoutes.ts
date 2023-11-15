import { Router } from "express";
import CategoryController from "../controllers/categoryController";

const categoryRouter = Router();
const categoryController = new CategoryController(categoryRouter);

export default categoryRouter;
