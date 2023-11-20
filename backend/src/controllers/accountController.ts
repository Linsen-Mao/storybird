import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { userSchema } from "../utils/validation";
import { encryptPswd, comparePswd } from "../utils/encrypt";
import jwt from "jsonwebtoken";
import { LoginParams } from "../utils/params";

class AuthController {
  private prisma: PrismaClient;
  private router: Router;

  constructor(router: Router) {
    this.prisma = new PrismaClient();
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const { error, value: newUser } = userSchema.validate(req.body);
    if (error) {
      throw new AppError("UserSchema Validation error", 400);
    }
    const { email } = req.body;

    if (newUser.password) {
      newUser.password = await encryptPswd(newUser.password);
    }
    const user = await this.prisma.user.update({
      where: { email },
      data: newUser,
    });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User register successfully",
      user: userWithoutPassword,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginParams;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!(await comparePswd(password, user.password))) {
      throw new AppError("Invalid password", 401);
    }

    const tokenParams = {
      id: user.id,
      name: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenParams, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ message: "Login successful", token });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    req.cookies.token = "";
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  };
}

export default AuthController;
