import { Router } from "express";
import userRouter from "./userRoutes";
import accountRouter from "./accountRoutes";
import storyRouter from "./storyRoutes";
import storyImageRouter from "./storyImageRoutes";
import categoryRouter from "./categoryRoutes";

const router = Router();

router.use("/users", userRouter);
router.use("/", accountRouter);
router.use("/stories", storyRouter);
// router.use("/stories/:storyID/images", storyImageRouter);
router.use("/images", storyImageRouter);
router.use("/categories", categoryRouter);

export default router;
