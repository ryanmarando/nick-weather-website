import { RequestHandler, Response, Request } from "express";
import { prisma } from "../config"


export const getAllVideos: RequestHandler = async (req, res) => {
    
   const allVideos = await prisma.youtubeVideo.findMany({})
    return  res.status(200).json(allVideos);
  };


// CREATE a new YouTube video
export const createYoutubeVideo = async (req: Request, res: Response) => {
  try {
    const { url, title, adminId, onFrontpage } = req.body;

    if (!url || !title) {
      return res.status(400).json({ message: "URL and title are required" });
    }

    const newVideo = await prisma.youtubeVideo.create({
      data: {
        url,
        title,
        adminId: adminId ? parseInt(adminId) : undefined,
        onFrontpage: onFrontpage ?? false
      },
    });

    return res.status(201).json({ video: newVideo });
  } catch (error) {
    console.error("Error creating YouTube video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET YouTube video by ID
export const getYoutubeVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.youtubeVideo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({ video });
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE YouTube video by ID
export const updateYoutubeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { url, title, onFrontpage } = req.body;

    const existingVideo = await prisma.youtubeVideo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    const updatedVideo = await prisma.youtubeVideo.update({
      where: { id: parseInt(id) },
      data: {
        url: url ?? existingVideo.url,
        title: title ?? existingVideo.title,
        onFrontpage: onFrontpage ?? existingVideo.onFrontpage
      },
    });

    return res.status(200).json({ video: updatedVideo });
  } catch (error) {
    console.error("Error updating YouTube video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE YouTube video by ID
export const deleteYoutubeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingVideo = await prisma.youtubeVideo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    await prisma.youtubeVideo.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting YouTube video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
