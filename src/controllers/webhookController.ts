import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { labelReviewEventsHandlers } from "../validators/labels";
import { EventTypes, ILabel, NO_REVIEW_USERS } from "../types/gitlab";

export const handleGitLabWebhook = async (req: Request, res: Response) => {
  const event = req.body;
  logger.info("Evento recebido:", event);

  if (canProcessReviewEvent(event)) {
    const labels = event.labels || [];
    const issue = event.object_attributes;
    const user = event.user;
    const assignees = event.assignees ?? [];
    const matchedHandler = labelReviewEventsHandlers?.find((h) =>
      h.check(labels)
    );

    if (!matchedHandler) {
      logger.info("Nenhum handler encontrado para as labels:", labels);
      return res
        .status(200)
        .send("Evento recebido sem labels correspondentes.");
    }

    const success = await matchedHandler.handle(issue, assignees, user);

    if (success) {
      return res.status(200).send("Evento processado com sucesso");
    } else {
      return res.status(500).send("Erro ao processar evento");
    }
  }

  return res.status(200).send("Evento recebido.");
};

const canProcessReviewEvent = (event: any): boolean => {
  if (
    event.labels?.some(
      (label: ILabel) =>
        label.title.startsWith(EventTypes.TEST_ENVIRONMENT_PREFIX) ||
        label.title === EventTypes.READY_TO_TEST ||
        NO_REVIEW_USERS.includes(event.user.id)
    )
  ) {
    return false;
  }
  return (
    event.object_kind === EventTypes.ISSUE &&
    event.object_attributes &&
    event.object_attributes?.action === EventTypes.UPDATE &&
    event.user.username !== EventTypes.QA_USER
  );
};

const canProcessNewHotfixEvent = (event: any) => {
  return;
};

const canProcessDeployEvent = (event: any) => {
  return;
};
