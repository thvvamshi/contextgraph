import { Request, Response } from "express";

import { ContextService } from "../services/context.service.js";

export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  getShowcaseContext = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const customerTier = req.query.customerTier;

      if (typeof customerTier !== "string" || !customerTier.trim()) {
        res.status(400).json({
          success: false,
          message: "customerTier query parameter is required",
        });

        return;
      }

      const data =
        await this.contextService.getShowcaseContext(customerTier);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Showcase context error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve showcase context",
      });
    }
  };
}