import { Router } from "express";
import StoryImageController from "../controllers/storyImageController";

const storyImageRouter = Router({ mergeParams: true });
const storyImageController = new StoryImageController(storyImageRouter);

export default storyImageRouter;
