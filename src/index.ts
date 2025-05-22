import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

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
    event.object_kind === "merge_request" &&
    event.object_attributes.action === "update"
  ) {
    const labels = event.labels?.map((label: any) => label.title) || [];

    if (labels.includes("code-review")) {
      const mr = event.object_attributes;
      const user = event.user;

      const teamsPayload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        summary: "Merge Request atualizada para Code Review",
        themeColor: "0076D7",
        title: `🔍 Merge Request em revisão: ${mr.title}`,
        sections: [
          {
            activityTitle: `Por: **${user.name}**`,
            activitySubtitle: `Projeto: ${event.project.name}`,
            facts: [
              {
                name: "Branch:",
                value: `${mr.source_branch} → ${mr.target_branch}`,
              },
              { name: "Status:", value: mr.state },
              { name: "Link:", value: `[Abrir MR](${mr.url})` },
            ],
            markdown: true,
          },
        ],
      };

      try {
        await axios.post(TEAMS_WEBHOOK_URL, teamsPayload);
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
