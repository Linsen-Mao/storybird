import { Router } from "express";
import AccountController from "../controllers/accountController";

const accountRouter = Router();
const accountController = new AccountController(accountRouter);

export default accountRouter;
