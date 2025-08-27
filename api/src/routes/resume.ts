import express from "express";
import {getResumes, uploadResume, deleteResume} from "../controllers/resume"
import { authenticate } from "../middlware/authMiddleware";
import { upload } from "../middlware/multer";

const router = express.Router();

router.get("/", getResumes);
router.post("/", authenticate, upload.array("resume"), uploadResume);
router.delete("/:id", authenticate, deleteResume)

export default router