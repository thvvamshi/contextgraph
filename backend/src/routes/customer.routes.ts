import { Router } from "express";

import { CustomerController } from "../controllers/customer.controller.js";
import { CustomerService } from "../services/customer.service.js";
import { GraphRepository } from "../repositories/graph.repository.js";

const router = Router();

const graphRepository = new GraphRepository();
const customerService = new CustomerService(graphRepository);
const customerController = new CustomerController(customerService);

router.get(
  "/:customerId/context",
  customerController.getCustomerContext
);

router.get(
  "/:customerId/experts",
  customerController.discoverExperts
);

router.get(
  "/:customerId/resolution",
  customerController.getResolutionContext
);

router.get(
  "/:customerId/agent-context",
  customerController.getAgentContext
);

export default router;