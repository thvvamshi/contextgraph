import { Request, Response } from "express";

import { CustomerService } from "../services/customer.service.js";
import { customerIdParamSchema } from "../schemas/customer.schema.js";

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  getCustomerContext = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.getCustomerContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Customer context error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve customer context",
      });
    }
  };

  discoverExperts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.discoverExperts(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Expert discovery error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to discover experts",
      });
    }
  };

  getResolutionContext = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.getResolutionContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Resolution context error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve resolution context",
      });
    }
  };

  getAgentContext = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = customerIdParamSchema.parse(req.params);

      const data = await this.customerService.getAgentContext(customerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Agent context error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve agent context",
      });
    }
  };
}
