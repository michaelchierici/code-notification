import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

import { ILabel, ITeamsWebhookPayload } from "./interface";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL || "";
const GITLAB_SECRET_TOKEN = process.env.GITLAB_SECRET_TOKEN || "";

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("GitLab → Teams Webhook ativo.");
});

app.post("/gitlab-webhook", async (req: Request, res: Response) => {
  const token = req.headers["x-gitlab-token"];

  if (token !== GITLAB_SECRET_TOKEN) {
    return res.status(403).send("Token inválido");
  }

  const event = req.body;

  if (
    event.object_kind === "issue" &&
    event.object_attributes.action === "update"
  ) {
    const labels = event.labels?.map((label: ILabel) => label.title) || [];

    if (labels.includes("codereview::pending")) {
      const issue = event.object_attributes;
      const user = event.user;

      const issuePayload: ITeamsWebhookPayload = {
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
              type: "AdaptiveCard",
              version: "1.4",
              body: [
                {
                  type: "TextBlock",
                  size: "Large",
                  weight: "Bolder",
                  text: "🚀 Novo pedido de *Code Review*",
                },
                {
                  type: "TextBlock",
                  weight: "bolder",
                  text: `📝 ${issue.title} (#${issue.iid})`,
                },
                {
                  type: "TextBlock",
                  color: "default",
                  text: `👤 ${user.name} (${user.username})`,
                },
                {
                  type: "TextBlock",
                  color: "accent",
                  text: `[🔗 Abrir issue](${issue.url})`,
                },
              ],
              $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            },
          },
        ],
      };

      try {
        await axios.post(TEAMS_WEBHOOK_URL, issuePayload);
        console.log("Evento enviado para o Teams:", issuePayload);
        return res.status(200).send("Mensagem enviada ao Teams");
      } catch (error: any) {
        console.error("Erro ao enviar para o Teams:", error.message);
        return res.status(500).send("Erro ao enviar para o Teams");
      }
    }
  }

  res.status(200).send("Evento recebido.");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
