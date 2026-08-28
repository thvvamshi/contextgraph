import { NextFunction, Request, Response } from "express";

import { CustomerService } from "../services/customer.service.js";
import { customerIdParamSchema } from "../schemas/customer.schema.js";

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * ------------------------------------------------------------------------
   * GET ALL CUSTOMERS
   * ------------------------------------------------------------------------
   *
   * GET /api/customers
   *
   * Returns all customers available in the knowledge graph.
   *
   * Used by the frontend to dynamically populate the
   * customer selector in the Ask Agent page.
   */
  getCustomers = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.customerService.getCustomers();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * GET CUSTOMER CONTEXT
   * ------------------------------------------------------------------------
   *
   * GET /api/customers/:customerId
   *
   * Returns the complete context associated with a customer.
   */
  getCustomerContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.getCustomerContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * DISCOVER EXPERTS
   * ------------------------------------------------------------------------
   *
   * GET /api/customers/:customerId/experts
   */
  discoverExperts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.discoverExperts(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * GET RESOLUTION CONTEXT
   * ------------------------------------------------------------------------
   *
   * GET /api/customers/:customerId/resolution
   */
  getResolutionContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.getResolutionContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * GET AGENT CONTEXT
   * ------------------------------------------------------------------------
   *
   * GET /api/customers/:customerId/agent-context
   */
  getAgentContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.getAgentContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * GET SIMILAR TICKETS
   * ------------------------------------------------------------------------
   *
   * GET /api/customers/tickets/:ticketId/similar
   *
   * Optional query parameter:
   *
   * ?limit=5
   */
  getSimilarTickets = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ticketId = String(req.params.ticketId);

      /**
       * Validate ticket ID.
       */
      if (!ticketId || ticketId === "undefined") {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_TICKET_ID",
            message: "ticketId is required",
          },
        });

        return;
      }

      /**
       * Validate optional limit.
       */
      const rawLimit = req.query.limit;

      let limit = 5;

      if (rawLimit !== undefined) {
        const parsedLimit = Number(rawLimit);

        if (
          !Number.isInteger(parsedLimit) ||
          parsedLimit < 1 ||
          parsedLimit > 50
        ) {
          res.status(400).json({
            success: false,
            error: {
              code: "INVALID_LIMIT",
              message: "limit must be an integer between 1 and 50",
            },
          });

          return;
        }

        limit = parsedLimit;
      }

      /**
       * Query similar tickets.
       */
      const data = await this.customerService.getSimilarTickets(
        ticketId,
        limit,
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
