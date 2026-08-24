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

router.get(
  "/customers/:customerId/issue-context",
  async (req, res) => {
    try {
      const { customerId } = req.params;

      const data =
        await graphRepository.getCustomerRelevantContext(
          customerId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "Customer issue context error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to retrieve issue context",
      });
    }
  }
);

export default router;