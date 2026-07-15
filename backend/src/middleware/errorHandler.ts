import { NextFunction, Request, Response } from "express";
import { AxiosError } from "axios";
import { ZodError, flattenError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: flattenError(err).fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational || err.statusCode >= 500) {
      logger.error(err.message, err);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof AxiosError) {
    const statusCode = err.response?.status ?? 502;
    const retryableCodes = new Set([
      "EAI_AGAIN",
      "ENOTFOUND",
      "ETIMEDOUT",
      "ECONNABORTED",
      "ECONNREFUSED",
    ]);

    let message = "External service request failed";

    if (!err.response && retryableCodes.has(err.code ?? "")) {
      message =
        "External service is temporarily unavailable. Please try again.";
    } else if (err.response?.data && typeof err.response.data === "object") {
      const data = err.response.data as Record<string, unknown>;

      if (typeof data.message === "string") {
        message = data.message;
      } else if (typeof data.error === "string") {
        message = data.error;
      }
    }

    logger.error(message, err);

    res.status(statusCode).json({
      success: false,
      message,
    });
    return;
  }

  if (err instanceof Error) {
    logger.error(err.message, err);

    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    });
    return;
  }

  logger.error("Unknown error", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
