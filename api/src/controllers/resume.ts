import { Request, Response } from "express";
import { prisma } from "../config";
import { deleteFromS3 } from "../middlware/s3Client";

export const saveResumeRecord = async (req: Request, res: Response) => {
  try {
    const { fileUrl, adminId } = req.body;

    if (!fileUrl) return res.status(400).json({ error: "No fileUrl provided" });

    const resume = await prisma.resumeImage.create({
      data: {
        url: fileUrl,
        adminId: adminId ? Number(adminId) : null,
      },
    });

    res.status(201).json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save resume record" });
  }
};

export const getResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await prisma.resumeImage.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching resumes" });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resumeImage.findUnique({
      where: { id: Number(id) },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Extract S3 key from URL
    const urlParts = resume.url.split("/");
    const s3Key = urlParts.slice(3).join("/"); // bucket-name/path/to/file

    await deleteFromS3(s3Key);
    await prisma.resumeImage.delete({ where: { id: Number(id) } });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting resume" });
  }
};
