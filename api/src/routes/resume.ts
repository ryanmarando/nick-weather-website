import express from "express";
import * as resumeController from "../controllers/resume"

const router = express.Router();

router.get("/", resumeController.getAllResumeImages);

export default router