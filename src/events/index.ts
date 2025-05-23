import { config } from "../config";
import { sendTeamsNotification } from "../services/teamsService";
import { createCodeReviewCard } from "../templates/code-review";


export async function sendCodeReviewEvent(issue: any, user: any): Promise<boolean> {
  try {
    const template = createCodeReviewCard(issue, user);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true
  } catch (error) {
    console.error('Erro ao enviar notificação de code review:', error);
    return false
  }
}