import { Router } from "express";
import userRouter from "./userRoutes";
import accountRouter from "./accountRoutes";

const router = Router();

router.use("/users", userRouter);
router.use("/account", accountRouter);

export default router;
