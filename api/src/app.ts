import express, { Request, Response } from "express";
import cors from "cors";
import logging from "./middlware/logging";
import blogRouter from "./routes/blog";
import youtubeRouter from "./routes/youtube";
import resumeRouter from "./routes/resume";
import authRouter from "./routes/auth";
import s3Router from "./routes/s3";

const app = express();
const PORT = Number(process.env.PORT);

const corsOptions = {
  origin: ["http://localhost:5173", "http://admin.localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(logging.logRequest);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from Nick Dunn's Weather API!" });
});

app.use("/s3", s3Router);
app.use("/auth", authRouter);
app.use("/uploads", express.static("uploads"));
app.use("/blog", blogRouter);
app.use("/youtube", youtubeRouter);
app.use("/resume", resumeRouter);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
