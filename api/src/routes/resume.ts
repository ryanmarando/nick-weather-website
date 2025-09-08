import express from "express";
import {
  getResumes,
  saveResumeRecord,
  deleteResume,
} from "../controllers/resume";
import { authenticate } from "../middlware/authMiddleware";

const router = express.Router();

router.get("/", getResumes);
router.post("/", authenticate, saveResumeRecord);
router.delete("/:id", authenticate, deleteResume);

export default router;
