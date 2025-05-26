import { config } from "../config";
import { sendTeamsNotification } from "../services/teamsService";
import {
  createCodeReviewPendingTemplate,
  createCodeReviewHotfixTemplate,
  createHotfixTemplate,
  createDeployIssueTemplate,
  createMergeRequestValidatedTemplate,
  createMergeRequestFailTemplate,
  createMergeRequestFixedTemplate,
} from "../templates";
import { IGitlabAssignee } from "../types/gitlab";
import { logger } from "../utils/logger";

export async function sendCodeReviewPendingEvent(
  issue: any,
  assignees: IGitlabAssignee[]
): Promise<boolean> {
  try {
    const template = createCodeReviewPendingTemplate(issue, assignees);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de code review:", error);
    return false;
  }
}

export async function sendCodeReviewValidatedEvent(
  issue: any,
  assignees: IGitlabAssignee[],
  revisor: IGitlabAssignee,
): Promise<boolean> {
  try {
    logger.info("Esse é o valor de assignees: ", assignees)
    const template = createMergeRequestValidatedTemplate(issue, assignees, revisor);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de merge request:", error);
    return false;
  }
}

export async function sendCodeReviewFailEvent(
  issue: any,
  assignees: IGitlabAssignee[],
  revisor: IGitlabAssignee,
): Promise<boolean> {
  try {
    const template = createMergeRequestFailTemplate(issue, assignees, revisor);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de merge request:", error);
    return false;
  }
}

export async function sendCodeReviewFixedEvent(
  issue: any,
  assignees: IGitlabAssignee[]
): Promise<boolean> {
  try {
    const template = createMergeRequestFixedTemplate(issue, assignees);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de merge request:", error);
    return false;
  }
}

export async function sendCodeReviewHotfixEvent(
  issue: any,
  assignees: IGitlabAssignee[]
): Promise<boolean> {
  try {
    const template = createCodeReviewHotfixTemplate(issue, assignees);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de code review:", error);
    return false;
  }
}

export async function sendHoftixEvent(issue: any): Promise<boolean> {
  try {
    const template = createHotfixTemplate(issue);
    await sendTeamsNotification(config.hotfixWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de hotfix:", error);
    return false;
  }
}

export async function sendDeployEvent(
  issue: any,
  assignees: IGitlabAssignee[]
): Promise<boolean> {
  try {
    const template = createDeployIssueTemplate(issue, assignees);
    await sendTeamsNotification(config.deployWebhookUrl, template);
    return true;
  } catch (error) {
    logger.error("Erro ao enviar notificação de deploy:", error);
    return false;
  }
}
