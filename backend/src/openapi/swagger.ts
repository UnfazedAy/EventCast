import { NextFunction, Request, Response, Router } from "express";
import swaggerUi from "swagger-ui-express";
import {
  generateOpenApiDocument,
  resolveOpenApiServerUrl,
} from "./document";

export const swaggerRouter = Router();

function getServerUrlFromRequest(req: Request): string {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto ?? req.protocol;
  const host = req.get("x-forwarded-host") ?? req.get("host");

  return resolveOpenApiServerUrl(protocol, host);
}

swaggerRouter.get("/openapi.json", (req, res) => {
  res.status(200).json(generateOpenApiDocument(getServerUrlFromRequest(req)));
});

swaggerRouter.use(
  "/",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const setup = swaggerUi.setup(
      generateOpenApiDocument(getServerUrlFromRequest(req)),
      {
        customSiteTitle: "EventCast API Docs",
        swaggerOptions: {
          persistAuthorization: true,
        },
      },
    );

    setup(req, res, next);
  },
);
