import express from "express";
import cors from "cors";

import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ContextGraph API is running",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

export default app;