import { Router } from "express";

import { GraphRepository } from "../repositories/graph.repository.js";
import { AIContextService } from "../services/ai-context.service.js";
import { AIContextController } from "../controllers/ai-context.controller.js";

const router = Router();

const graphRepository = new GraphRepository();

const aiContextService =
  new AIContextService(graphRepository);

const aiContextController =
  new AIContextController(aiContextService);

router.get(
  "/customers/:customerId",
  aiContextController.getCustomerAIContext
);

router.post(
  "/customers/:customerId/query",
  aiContextController.answerCustomerQuestion
);

export default router;