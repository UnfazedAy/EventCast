import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";

const service = new EventService();

export class EventController {
  async assess(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await service.assess(req.body);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}