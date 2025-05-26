import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { labelHandlers } from "../validators/labels";
import { EventTypes, IGitlabAssignee, ILabel } from "../types/gitlab";

export const handleGitLabWebhook = async (req: Request, res: Response) => {
  const event = req.body;
  logger.info("Evento recebido:", event);

  if (canProcessReviewEvent(event)) {
    const labels = event.labels || [];
    const issue = event.object_attributes;
    const user = event.user
    const assignees = event.assignees ?? []
    const matchedHandler = labelHandlers?.find((h) => h.check(labels));

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
  if (event.labels?.some((label: ILabel) =>
    label.title.startsWith(EventTypes.TEST_ENVIRONMENT_PREFIX) ||
    label.title === EventTypes.READY_TO_TEST
  )) {
    return false;
  }
  return (
    event.object_kind === EventTypes.ISSUE &&
    event.object_attributes &&
    event.object_attributes?.action === EventTypes.UPDATE &&
    event.user.username !== EventTypes.QA_USER
  );
}

const canProcessNewHotfixEvent = (event: any) => { return }

const canProcessDeployEvent = (event: any) => { return }
