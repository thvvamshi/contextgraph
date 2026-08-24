import { Router } from "express";

import { GraphController } from "../controllers/graph.controller.js";
import { GraphService } from "../services/graph.service.js";
import { GraphRepository } from "../repositories/graph.repository.js";

const router = Router();

const graphRepository = new GraphRepository();
const graphService = new GraphService(graphRepository);
const graphController = new GraphController(graphService);

router.get("/", graphController.getGraphVisualization);

export default router;