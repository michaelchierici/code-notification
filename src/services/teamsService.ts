import axios from "axios";
import { logger } from "../utils/logger";
import { ITeamsWebhookPayload } from "../types/teams";

export const sendTeamsNotification = async (webhookUrl: string, payload: ITeamsWebhookPayload): Promise<boolean> => {
  try {
    await axios.post(webhookUrl, payload);
    logger.info("Evento enviado para o Teams");
    return true;
  } catch (error: any) {
    logger.error(`Erro ao enviar para o Teams: ${error.message}`);
    return false;
  }
};