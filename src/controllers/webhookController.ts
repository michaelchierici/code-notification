import { Request, Response } from "express";
import {
  sendCodeReviewPendingEvent,
  sendCodeReviewValidatedEvent,
  sendCodeReviewFailEvent,
  sendCodeReviewFixedEvent,
  sendCodeReviewHotfixEvent,
  sendDeployEvent,
  sendHoftixEvent,
} from "../events";
import {
  hasCodeReviewPendingLabel,
  hasCodeReviewValidatedLabel,
  hasCodeReviewFailLabel,
  hasCodeReviewFixedLabel,
  hasCodeReviewPendingHotfixLabel,
  hasCodeReviewValidatedAndDoneLabel,
  hasHotfixLabel,
} from "../services/gitlabService";

export const handleGitLabWebhook = async (req: Request, res: Response) => {
  const event = req.body;
  console.log("Evento recebido:", event);
  if (
    event.object_kind === "issue" &&
    event.object_attributes &&
    event.object_attributes.action === "update"
  ) {
    const labels = event.labels || [];
    const issue = event.object_attributes;
    const user = event.user;
    let notificationWasSent = false;

    if (hasCodeReviewPendingLabel(labels)) {
      notificationWasSent = await sendCodeReviewPendingEvent(issue, user);
    }

    if (hasCodeReviewValidatedLabel(labels)) {
      notificationWasSent = await sendCodeReviewValidatedEvent(issue, user);
    }

    if (hasCodeReviewFailLabel(labels)) {
      notificationWasSent = await sendCodeReviewFailEvent(issue, user);
    }

    if (hasCodeReviewFixedLabel(labels)) {
      notificationWasSent = await sendCodeReviewFixedEvent(issue, user);
    }

    if (hasCodeReviewPendingHotfixLabel(labels)) {
      notificationWasSent = await sendCodeReviewHotfixEvent(issue, user);
    }

    if (hasCodeReviewValidatedAndDoneLabel(labels)) {
      notificationWasSent = await sendDeployEvent(issue, user);
    }

    if (hasHotfixLabel(labels)) {
      notificationWasSent = await sendHoftixEvent(issue);
    }

    if (notificationWasSent) {
      return res.status(200).send("Evento processado com sucesso");
    } else {
      return res.status(500).send("Erro ao processar evento");
    }
  }

  return res.status(200).send("Evento recebido.");
};
