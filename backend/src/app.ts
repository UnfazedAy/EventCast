import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { swaggerRouter } from "./openapi/swagger";
import eventRoutes from "./routes/event-routes";
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EventCast API."
  });
});

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "EventCast API is running."
  });
});

app.use("/api-docs", swaggerRouter);
app.use("/api/v1/events", eventRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
