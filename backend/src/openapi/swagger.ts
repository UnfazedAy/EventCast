import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./document";

const openApiDocument = generateOpenApiDocument();

export const swaggerRouter = Router();

swaggerRouter.get("/openapi.json", (_req, res) => {
  res.status(200).json(openApiDocument);
});

swaggerRouter.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "EventCast API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);
