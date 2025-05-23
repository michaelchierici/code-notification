import { Request, Response } from "express";
import { hasCodeReviewLabel, createCodeReviewNotification } from "../services/gitlabService";
import { sendTeamsNotification } from "../services/teamsService";
import { logger } from "../utils/logger";

export const handleGitLabWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  if (
    event.object_kind === "issue" &&
    event.object_attributes &&
    event.object_attributes.action === "update"
  ) {
    const labels = event.labels || [];

    if (hasCodeReviewLabel(labels)) {
      const issue = event.object_attributes;
      const user = event.user;

      const notificationPayload = createCodeReviewNotification(issue, user);

      const success = await sendTeamsNotification(notificationPayload);

      if (success) {
        return res.status(200).send("Mensagem enviada ao Teams");
      } else {
        return res.status(500).send("Erro ao enviar para o Teams");
      }
    }
  }

  res.status(200).send("Evento recebido.");
};