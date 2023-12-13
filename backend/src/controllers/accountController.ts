import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { authenticateUser } from "../auth/auth";
class AuthController {
  private prisma: PrismaClient;
  private router: Router;

  constructor(router: Router) {
    this.prisma = new PrismaClient();
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Both email and password are required.", 400);
    }

    const token = await authenticateUser(email, password);

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ message: "Login successful", token, userId: user.id });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("jwt");
    res.json({ message: "Logout successful" });
  };
}

export default AuthController;