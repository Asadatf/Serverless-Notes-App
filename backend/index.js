import express from "express";
import mongoose from "mongoose";
import "dotenv-flow/config";
import cors from "cors";
import userRoutes from "./routes/user.js";
import notesRoutes from "./routes/notes.js";
import { FRONTEND_ORIGIN } from "./constants.js";
import logger from "./utils/logger.js";
import serverless from "serverless-http";

const app = express();

// middleware
app.use(express.json());
app.use(express.json({ limit: "50mb" }));

// Set up CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhots:5173", // your React app's origin
    methods: ["GET", "POST", "PATCH", "DELETE"], // add other methods as needed
    credentials: true, // include cookies or auth headers if needed
  })
);

app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.path}`);
  next();
});

// routes
app.use("/api/user", userRoutes); // user routes

app.use("/api/notes", notesRoutes); // notes routes

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      logger.info(`Connected to db & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${error.message}`);
  });

export const handler = serverless(app);
