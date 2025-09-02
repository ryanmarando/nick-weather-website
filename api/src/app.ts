import express, { Request, Response } from "express";
import cors from "cors";
import logging from "./middlware/logging";
import blogRouter from "./routes/blog";
import youtubeRouter from "./routes/youtube";
import resumeRouter from "./routes/resume";
import authRouter from "./routes/auth";

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(logging.logRequest);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://admin.localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from Nick Dunn's Weather API!" });
});

app.use("/auth", authRouter);
app.use("/uploads", express.static("uploads"));
app.use("/blog", blogRouter);
app.use("/youtube", youtubeRouter);
app.use("/resume", resumeRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
