import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { validate } from "../middleware/validate";
import { assessEventSchema } from "../validators/event.validator";

const router = Router();

const controller = new EventController();

router
  .route("/assess")
  .post(validate(assessEventSchema), controller.assess.bind(controller));

export default router;