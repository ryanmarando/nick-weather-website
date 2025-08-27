import { Router } from "express";
import { getAllVideos, createYoutubeVideo, getYoutubeVideoById, updateYoutubeVideo, deleteYoutubeVideo } from "../controllers/youtube";
import { authenticate } from "../middlware/authMiddleware";
const router = Router();

router.get("/", getAllVideos)
router.post("/", authenticate, createYoutubeVideo);
router.get("/:id", getYoutubeVideoById); 
router.patch("/:id", authenticate, updateYoutubeVideo); 
router.delete("/:id", authenticate, deleteYoutubeVideo); 

export default router;
