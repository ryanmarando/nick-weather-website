import { Request, Response } from "express";
import { prisma } from "../config";
import { deleteFromS3 } from "../middlware/s3Client";

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
    const { title, content, imageUrls, blocks } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const newBlog = await prisma.blogPost.create({
      data: {
        title,
        content: content || "",
        blocks: blocks || [],
        images: {
          create: imageUrls?.map((url: string) => ({ url })) || [],
        },
      },
      include: { images: true },
    });

    res.status(201).json({ blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE /blog/:id — update a blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blogId = Number(req.params.id);
    const { title, content, deleteImageIds, newImageUrls, blocks } = req.body;

    // Support both number[] and comma-separated string for deleteImageIds
    const idsToDelete: number[] = Array.isArray(deleteImageIds)
      ? deleteImageIds
      : deleteImageIds
      ? (deleteImageIds as string).split(",").map(Number)
      : [];

    // Delete images if any
    if (idsToDelete.length > 0) {
      const imagesToDelete = await prisma.blogImage.findMany({
        where: { id: { in: idsToDelete }, blogPostId: blogId },
      });

      // Delete from S3
      for (const img of imagesToDelete) {
        const key = img.url.split("/").pop();
        if (key) await deleteFromS3(key);
      }

      // Delete from DB
      await prisma.blogImage.deleteMany({
        where: { id: { in: idsToDelete }, blogPostId: blogId },
      });
    }

    // Prepare new images for creation
    const newImagesData = Array.isArray(newImageUrls)
      ? newImageUrls.map((url) => ({ url }))
      : [];

    // Update blog
    const updatedBlog = await prisma.blogPost.update({
      where: { id: blogId },
      data: {
        title: title || undefined,
        content: content || undefined,
        blocks: blocks || undefined,
        images:
          newImagesData.length > 0 ? { create: newImagesData } : undefined,
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
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete images from S3
    for (const img of blog.images) {
      const key = img.url.split("/").pop();
      if (key) await deleteFromS3(key);
    }

    // Delete images from DB
    await prisma.blogImage.deleteMany({
      where: { blogPostId: blog.id },
    });

    // Delete blog itself
    await prisma.blogPost.delete({
      where: { id: blog.id },
    });

    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Failed to delete blog" });
  }
};

export const fakePost = async (req: Request, res: Response) => {
  try {
    const blogData = {
      id: 37,
      title: "Dry Weekend Ahead",
      content:
        "September 26, 2025: Happy Friday, everyone! Weather Specialist Nick Dunn here to break down the forecast as we look over the next several days! We had some fog this morning, but it was great to see sunshine to end the week. temperatures have climbed into the middle 70s, which is right on par for where we should be this time of year. We remain perfect weather wise for high school football in terms of avoiding rain! Tonight will be much cooler than last week, but staying dry. We will fall into the 60s by the end of any games tonight. Some patchy fog could develop overnight, but not as widespread as this morning. Saturday will be dry and generally sunny after any patchy fog early mixes out. Highs climb to the low 80s, which is about five degrees above normal for the last weekend of September! Sunday will be a carbon copy, but a just warmer with lower to maybe even a few middle 80s. It is likely we are dry for the next seven days.",
      createdAt: new Date("2025-09-30T14:40:52.322Z"),
      adminId: null,
      images: [
        {
          url: "https://nickdunn-weather-website.s3.us-east-2.amazonaws.com/Screenshot 2025-09-30 103839.png",
        },
      ],
    };

    const created = await prisma.blogPost.create({
      data: {
        title: blogData.title,
        content: blogData.content,
        createdAt: blogData.createdAt,
        adminId: blogData.adminId,
        images: {
          create: blogData.images.map((img) => ({ url: img.url })),
        },
      },
      include: { images: true },
    });

    res.json({ message: "Fake blog inserted", blog: created });
  } catch (err: any) {
    console.error("Error inserting fake blog:", err);
    res
      .status(500)
      .json({ message: "Failed to insert blog", error: err.message });
  }
};
