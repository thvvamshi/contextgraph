import {
  NextFunction,
  Request,
  Response,
} from "express";

import { ContextService } from "../services/context.service.js";
import { showcaseContextQuerySchema } from "../schemas/context.schema.js";

export class ContextController {
  constructor(
    private readonly contextService: ContextService,
  ) {}

  getShowcaseContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerTier } =
        showcaseContextQuerySchema.parse(req.query);

      const data =
        await this.contextService.getShowcaseContext(
          customerTier,
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