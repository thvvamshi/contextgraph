import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

import customerRoutes from "./routes/customer.routes.js";
import contextRoutes from "./routes/context.routes.js";
import graphRoutes from "./routes/graph.routes.js";
import aiContextRoutes from "./routes/ai-context.routes.js";

const app = express();

app.use(requestLogger);

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
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
app.use("/api/graph", graphRoutes);
app.use("/api/ai-context", aiContextRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
