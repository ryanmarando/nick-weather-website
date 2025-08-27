import { Request, Response } from "express";
import { prisma } from "../config";
import fs from "fs";
import path from "path";

// GET /blog — get all blogs
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ blogs });
    return;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// GET /blog/:id — get one blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blogPost.findUnique({
      where: { id: Number(id) },
      include: { images: true },
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res.json({ blog });
    return;
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// POST /blog — create a new blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required" });
      return;
    }


    const newBlog = await prisma.blogPost.create({
      data: {
        title,
        content,
        images: {
          create: req.files
            ? (req.files as Express.Multer.File[]).map(file => ({
                url: `/uploads/${file.filename}`,
              }))
            : [],
        },
      },
      include: { images: true },
    });
    
    

    res.status(201).json({ blog: newBlog });
    return;
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// PATCH /blog/:id — update a blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blogId = Number(req.params.id);
    const { title, content, deleteImageIds } = req.body;

    // Parse IDs to delete
    const idsToDelete = deleteImageIds
      ? (deleteImageIds as string).split(",").map(id => Number(id))
      : [];

    // ✅ Delete specified images
    if (idsToDelete.length > 0) {
      const imagesToDelete = await prisma.blogImage.findMany({
        where: { id: { in: idsToDelete }, blogPostId: blogId },
      });

      for (const image of imagesToDelete) {
        // ✅ Resolve the real file path from the stored URL
        const filePath = path.join(__dirname, "..", "..", "uploads", path.basename(image.url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.blogImage.deleteMany({
        where: { id: { in: idsToDelete }, blogPostId: blogId },
      });
    }

    // ✅ Handle new uploaded images
    const newImagesData = req.files
      ? (req.files as Express.Multer.File[]).map(file => ({
          url: `/uploads/${file.filename}`, 
        }))
      : [];

    const updatedBlog = await prisma.blogPost.update({
      where: { id: blogId },
      data: {
        title: title || undefined,
        content: content || undefined,
        images: newImagesData.length > 0 ? { create: newImagesData } : undefined,
      },
      include: { images: true },
    });

    res.status(200).json({ blog: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// DELETE /blog/:id — delete a blog
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find blog with its images
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: { images: true }
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ✅ Delete images from file system
    for (const image of blog.images) {
      const imagePath = path.join(__dirname, "..", "..", "uploads", path.basename(image.url));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // delete the file
      }
    }

    // ✅ Delete related images from DB first (to avoid FK constraint)
    await prisma.blogImage.deleteMany({
      where: { blogPostId: blog.id }
    });

    // ✅ Delete the blog post itself
    await prisma.blogPost.delete({
      where: { id: blog.id }
    });

    return res.json({ message: "Blog and associated images deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Failed to delete blog" });
  }
};
