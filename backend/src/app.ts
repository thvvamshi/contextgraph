import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import customerRoutes from "./routes/customer.routes.js";
import contextRoutes from "./routes/context.routes.js";

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

app.use("/api/customers", customerRoutes);
app.use("/api/context", contextRoutes);

export default app;