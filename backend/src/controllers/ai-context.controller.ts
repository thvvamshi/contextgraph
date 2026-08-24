import { NextFunction, Request, Response } from "express";

import { AIContextService } from "../services/ai-context.service.js";
import { customerIdParamSchema } from "../schemas/customer.schema.js";
import { AppError } from "../errors/app-error.js";

export class AIContextController {
  constructor(private readonly aiContextService: AIContextService) {}

  /**
   * GET /api/ai-context/customers/:customerId
   *
   * Returns the graph-grounded AI context for a customer.
   */
  getCustomerAIContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data =
        await this.aiContextService.buildCustomerContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/ai-context/customers/:customerId/query
   *
   * Answers a customer question using graph-grounded context.
   *
   * The response intentionally does not return the complete
   * graph context. Only the answer, model, evidence and
   * lightweight context statistics are returned.
   */
  answerCustomerQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const question =
        typeof req.body?.question === "string"
          ? req.body.question.trim()
          : "";

      if (!question) {
        throw new AppError(
          "Question is required",
          400,
          "QUESTION_REQUIRED",
        );
      }

      const answer =
        await this.aiContextService.answerCustomerQuestion(
          customerId,
          question,
        );

      const context = answer.context;

      res.status(200).json({
        success: true,
        data: {
          customerId: answer.customerId,

          question: answer.question,

          answer: answer.answer,

          model: answer.model,

          evidence: answer.evidence,

          contextSummary: {
            customer: context.customer?.label ?? null,

            ticketCount: context.tickets.length,

            productCount: context.products.length,

            bugCount: context.bugs.length,

            teamCount: context.teams.length,

            expertCount: context.experts.length,

            resolutionCount: context.resolutions.length,

            documentCount: context.documents.length,

            featureCount: context.features.length,

            relationshipCount: context.relationships.length,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/ai-context/customers/:customerId/issue
   *
   * Returns customer issue context.
   */
  getCustomerIssueContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data =
        await this.aiContextService.getCustomerIssueContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Alias for getCustomerAIContext.
   *
   * Kept for compatibility with existing route/controller wiring.
   */
  buildCustomerContext = this.getCustomerAIContext;
} 