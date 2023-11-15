import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AppError } from "../err/errorHandler";
import "express-async-errors";
import { userSchema } from "../utils/validation";
import { encryptPswd, comparePswd } from "../utils/encrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface LoginParams {
  email: string;
  password: string;
}

export const register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { error, value: newUser } = userSchema.validate(req.body);
    
    console.log(req.body);
    if (error) {
      throw new AppError("UserSchema Validation error", 400);
    }
    newUser.password = await encryptPswd(newUser.password);
  
    const user = await prisma.user.create({ data: newUser });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
  };

  // use jwt to create a token and send it back to the client
export const login = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, password } = req.body as LoginParams;
  
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
  
    const user = await prisma.user.findFirst({ where: { email } });
  
    if (!user) {
      throw new AppError("User not found", 404);
    }
  
    if (!(await comparePswd(password, user.password))) {
      throw new AppError("Invalid password", 401);
    }
    // create a token and return
    const tokenParams = {
      id: user.id,
      name: user.name,
      licensePlateNumber: user.licensePlateNumber.toString(),
      role: user.role,
    };
    const token = jwt.sign(tokenParams, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ message: "Login successful", token });
  } 

export const logout = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    req.cookies.token = "";
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  };