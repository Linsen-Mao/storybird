import { Router } from "express";
import StoryImageController from "../controllers/storyImageController";

const storyImageRouter = Router();
const storyImageController = new StoryImageController(storyImageRouter);

export default storyImageRouter;
