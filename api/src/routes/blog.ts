import express from "express";
import { authenticate } from "../middlware/authMiddleware";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", authenticate, createBlog);
router.patch("/:id", authenticate, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

export default router;
