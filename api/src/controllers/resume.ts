import { Request, Response } from "express";
import { prisma } from "../config"
import path from "path";
import fs from "fs";

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const adminId = req.body.adminId;

    // Create DB entries for each file
    const createdResumes = await Promise.all(
      files.map(file =>
        prisma.resumeImage.create({
          data: {
            url: `/uploads/${file.filename}`,
          },
        })
      )
    );

    res.status(201).json(createdResumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading resume image" });
  }
};



export const getResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await prisma.resumeImage.findMany({
      orderBy: { uploadedAt: "desc" }
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching resumes" });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resumeImage = await prisma.resumeImage.findUnique({ where: { id: Number(id) } });

    if (!resumeImage) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, "..", "..", "uploads", path.basename(resumeImage.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.resumeImage.delete({ where: { id: Number(id) } });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting resumeImage" });
  }
};