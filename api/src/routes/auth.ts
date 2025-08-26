import express from "express";
import { login, register } from "../controllers/auth";
import { authenticate } from "../middlware/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.post("/register", authenticate, register)

export default router;
