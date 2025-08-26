import express from "express";
import { authenticate } from "../middlware/authMiddleware";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog";
import { upload } from "../middlware/multer";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", authenticate, upload.array("images"), createBlog);
router.patch("/:id", authenticate, upload.array("images"), updateBlog);
router.delete("/:id", authenticate, deleteBlog);

export default router;
