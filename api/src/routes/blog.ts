import express from "express";
import * as blogController from "../controllers/blog"

const router = express.Router();

router.get("/", blogController.getAllBlogPosts);

export default router