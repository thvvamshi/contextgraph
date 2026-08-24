import { Router } from "express";

import { ContextController } from "../controllers/context.controller.js";
import { ContextService } from "../services/context.service.js";
import { GraphRepository } from "../repositories/graph.repository.js";

const router = Router();

const graphRepository = new GraphRepository();
const contextService = new ContextService(graphRepository);
const contextController = new ContextController(contextService);

router.get(
  "/showcase",
  contextController.getShowcaseContext
);

export default router;