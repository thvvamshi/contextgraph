import {
  NextFunction,
  Request,
  Response,
} from "express";

import { CustomerService } from "../services/customer.service.js";
import { customerIdParamSchema } from "../schemas/customer.schema.js";

export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
  ) {}

  getCustomerContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } =
        customerIdParamSchema.parse(req.params);

      const data =
        await this.customerService.getCustomerContext(
          customerId,
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  discoverExperts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } =
        customerIdParamSchema.parse(req.params);

      const data =
        await this.customerService.discoverExperts(
          customerId,
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getResolutionContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } =
        customerIdParamSchema.parse(req.params);

      const data =
        await this.customerService.getResolutionContext(
          customerId,
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getAgentContext = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } =
        customerIdParamSchema.parse(req.params);

      const data =
        await this.customerService.getAgentContext(
          customerId,
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