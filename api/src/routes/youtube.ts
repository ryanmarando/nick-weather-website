import express from "express";
import * as youtubeController from "../controllers/youtube"

const router = express.Router();

router.get("/", youtubeController.getAllVideos)
export default router