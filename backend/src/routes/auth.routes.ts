import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.middleware";

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(400, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "24h",
    });

    res.status(201).json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, "Invalid credentials");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "24h",
    });

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
