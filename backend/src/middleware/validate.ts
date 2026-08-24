import {
  Request,
  Response,
  NextFunction,
} from "express";
import { ZodType } from "zod";

import { AppError } from "../errors/app-error.js";

export const validate = (
  schema: ZodType,
  source: "params" | "query" | "body",
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(
        new AppError(
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );

      return;
    }

    req[source] = result.data;

    next();
  };
};