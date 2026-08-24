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
      const { customerId } =
        customerIdParamSchema.parse(req.params);

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
        error.message === "Customer not found"
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

  answerCustomerQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { customerId } =
        customerIdParamSchema.parse(req.params);

      const { question } = req.body;

      if (
        typeof question !== "string" ||
        !question.trim()
      ) {
        res.status(400).json({
          success: false,
          message: "question is required",
        });

        return;
      }

      const data =
        await this.aiContextService.answerCustomerQuestion(
          customerId,
          question.trim()
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "AI customer question error:",
        error
      );

      if (
        error instanceof Error &&
        error.message === "Customer not found"
      ) {
        res.status(404).json({
          success: false,
          message: "Customer not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Failed to answer customer question",
      });
    }
  };

  /**
   * Alias for consistency with the service naming.
   */
  buildCustomerContext = this.getCustomerAIContext;
}