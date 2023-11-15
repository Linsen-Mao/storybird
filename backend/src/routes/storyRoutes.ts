import { Router } from "express";
import StoryController from "../controllers/storyController";

const storyRouter = Router();
const storyController = new StoryController(storyRouter);

export default storyRouter;
