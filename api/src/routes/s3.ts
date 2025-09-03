import express from "express";
import { getPresignedUrl } from "../controllers/s3";
import { authenticate } from "../middlware/authMiddleware";

const router = express.Router();

router.post("/get-presigned-url", authenticate, getPresignedUrl);

export default router;
