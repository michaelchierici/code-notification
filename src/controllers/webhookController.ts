import { Request, Response } from "express";
import { hasCodeReviewLabel } from "../services/gitlabService";
import { sendCodeReviewEvent } from "../events";

export const handleGitLabWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  if (
    event.object_kind === "issue" &&
    event.object_attributes &&
    event.object_attributes.action === "update"
  ) {
    const labels = event.labels || [];
    const issue = event.object_attributes;
    const user = event.user;
    let notificationWasSent = false;

    if (hasCodeReviewLabel(labels)) {
      notificationWasSent = await sendCodeReviewEvent(issue, user);
    }

    if (notificationWasSent) {
      res.status(200).send('Evento processado com sucesso');
    } else {
      res.status(500).send('Erro ao processar evento');
    }
  }

  res.status(200).send("Evento recebido.");
};

