import { Request, Response } from "express";
import { prisma } from "../config";

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

    console.log("Uploaded files:", req.files);


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
    const { title, content } = req.body;

    if (!blogId) {
      res.status(400).json({ message: "Please enter a blog id." });
      return;
    }

    if (!title && !content && !req.files?.length) {
      res.status(400).json({ message: "Nothing to update" });
      return;
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id: blogId },
      data: {
        title: title || undefined,
        content: content || undefined,
        images: req.files
          ? {
              create: (req.files as Express.Multer.File[]).map(file => ({
                url: `/uploads/${file.filename}`,
              })),
            }
          : undefined,
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
  try {
    const { id } = req.params;

    const blog = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    await prisma.blogPost.delete({ where: { id: Number(id) } });

    res.json({ message: "Blog deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
