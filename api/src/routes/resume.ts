import express from "express";
import { getResumes, uploadResume, deleteResume } from "../controllers/resume";
import { authenticate } from "../middlware/authMiddleware";

const router = express.Router();

router.get("/", getResumes);
router.post("/", authenticate, uploadResume);
router.delete("/:id", authenticate, deleteResume);

export default router;
