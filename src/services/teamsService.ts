import axios from "axios";
import { logger } from "../utils/logger";
import { ITeamsWebhookPayload } from "../types/teams";

/**
 * Envia uma notificação para o Teams usando um webhook.
 * @param webhookUrl URL do webhook do Teams.
 * @param payload Payload a ser enviado.
 * @returns true se o envio for bem-sucedido, false caso contrário.
 */

export const sendTeamsNotification = async (
  webhookUrl: string,
  payload: ITeamsWebhookPayload
): Promise<boolean> => {
  try {
    await axios.post(webhookUrl, payload);
    logger.info("Evento enviado para o Teams");
    return true;
  } catch (error: any) {
    logger.error(`Erro ao enviar para o Teams: ${error.message}`);
    return false;
  }
};
