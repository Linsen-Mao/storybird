import { Router } from "express";
import {
    register,
    login,
    logout,
} from "../controllers/accountController";

const accountRouter = Router();

accountRouter.post("/register", register);
accountRouter.post("/login", login);
accountRouter.post("/logout", logout);

export default accountRouter;