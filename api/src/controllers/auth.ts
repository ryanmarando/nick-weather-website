import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config"; 

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
       res.status(401).json({ message: "Invalid email or password" });
       return
    }

    // 2. Compare password
    const isValid = await bcrypt.compare(password, admin.hashedPassword);
    if (!isValid) {
       res.status(401).json({ message: "Invalid email or password" });
       return
    }

    // 3. Create JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || "default_secret", 
      { expiresIn: "1h" }
    );

    // 4. Respond with token
    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
