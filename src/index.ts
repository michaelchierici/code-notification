import express from "express";
import { Request, Response } from "express";
import { config } from "./config";
import webhookRoutes from "./routes/webhook";
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.send("GitLab → Teams Webhook ativo.");
});
app.use(webhookRoutes);

app.listen(config.port, () => {
  logger.info(`Servidor rodando na porta ${config.port}`);
});