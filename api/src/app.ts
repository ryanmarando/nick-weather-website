import express, { Request, Response } from "express";
import logging from "./middlware/logging"
import blogRouter from "./routes/blog"
import youtubeRouter from "./routes/youtube"
import resumeRouter from "./routes/resume"

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(logging.logRequest);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Nick Dunn's Weather API!");
});

app.use("/blog", blogRouter);
app.use("/youtube", youtubeRouter);
app.use("/resume", resumeRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
