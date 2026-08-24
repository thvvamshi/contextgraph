import { Request, Response } from "express";

import { AIContextService } from "../services/ai-context.service.js";
import { customerIdParamSchema } from "../schemas/customer.schema.js";

export class AIContextController {
  constructor(
    private readonly aiContextService: AIContextService
  ) {}

  getCustomerAIContext = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(
        req.params
      );

      const data =
        await this.aiContextService.buildCustomerContext(
          customerId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("AI context error:", error);

      if (
        error instanceof Error &&
        "statusCode" in error &&
        error.statusCode === 404
      ) {
        res.status(404).json({
          success: false,
          message: "Customer not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Failed to build AI context",
      });
    }
  };

  /**
   * Alias for consistency with the service naming.
   */
  buildCustomerContext = this.getCustomerAIContext;
}