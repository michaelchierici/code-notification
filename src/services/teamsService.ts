import axios from "axios";
import { config } from "../config";
import { logger } from "../utils/logger";
import { ITeamsWebhookPayload } from "../types/teams";

export const sendTeamsNotification = async (payload: ITeamsWebhookPayload): Promise<boolean> => {
  try {
    await axios.post(config.teamsWebhookUrl, payload);
    logger.info("Evento enviado para o Teams");
    return true;
  } catch (error: any) {
    logger.error(`Erro ao enviar para o Teams: ${error.message}`);
    return false;
  }
};