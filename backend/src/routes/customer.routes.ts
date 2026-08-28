import { Router } from "express";

import { CustomerController } from "../controllers/customer.controller.js";
import { CustomerService } from "../services/customer.service.js";
import { GraphRepository } from "../repositories/graph.repository.js";

const router = Router();

/**
 * --------------------------------------------------------------------------
 * DEPENDENCY SETUP
 * --------------------------------------------------------------------------
 */

const graphRepository = new GraphRepository();

const customerService = new CustomerService(graphRepository);

const customerController = new CustomerController(customerService);

/**
 * --------------------------------------------------------------------------
 * CUSTOMER LIST
 * --------------------------------------------------------------------------
 *
 * GET /api/customers
 *
 * Returns all customers from the knowledge graph.
 *
 * This endpoint is used by the frontend to dynamically
 * populate the customer selector in Ask Agent.
 */
router.get("/", customerController.getCustomers);

/**
 * --------------------------------------------------------------------------
 * CUSTOMER CONTEXT
 * --------------------------------------------------------------------------
 *
 * GET /api/customers/:customerId/context
 */
router.get("/:customerId/context", customerController.getCustomerContext);

/**
 * --------------------------------------------------------------------------
 * CUSTOMER EXPERTS
 * --------------------------------------------------------------------------
 *
 * GET /api/customers/:customerId/experts
 */
router.get("/:customerId/experts", customerController.discoverExperts);

/**
 * --------------------------------------------------------------------------
 * CUSTOMER RESOLUTION
 * --------------------------------------------------------------------------
 *
 * GET /api/customers/:customerId/resolution
 */
router.get("/:customerId/resolution", customerController.getResolutionContext);

/**
 * --------------------------------------------------------------------------
 * CUSTOMER AGENT CONTEXT
 * --------------------------------------------------------------------------
 *
 * GET /api/customers/:customerId/agent-context
 */
router.get("/:customerId/agent-context", customerController.getAgentContext);

/**
 * --------------------------------------------------------------------------
 * SIMILAR TICKETS
 * --------------------------------------------------------------------------
 *
 * GET /api/customers/tickets/:ticketId/similar
 *
 * Optional:
 * GET /api/customers/tickets/:ticketId/similar?limit=5
 */
router.get("/tickets/:ticketId/similar", customerController.getSimilarTickets);

export default router;
