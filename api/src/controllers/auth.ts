import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config"; 

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

export const register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return
      }
  
      // 1. Check if the email already exists
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });
      if (existingAdmin) {
        res.status(400).json({ message: "Admin with this email already exists" });
        return
      }
  
      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 3. Create admin
      const newAdmin = await prisma.admin.create({
        data: { email, hashedPassword },
      });
  
      // 4. Generate JWT
      const token = jwt.sign(
        { id: newAdmin.id, email: newAdmin.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );
  
      // 5. Return admin info + token
      res.status(201).json({
        message: "Admin registered successfully",
        token,
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };