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
import { IGitlabUser } from "../types/gitlab";

export async function sendCodeReviewPendingEvent(
  issue: any,
  user: IGitlabUser
): Promise<boolean> {
  try {
    const template = createCodeReviewPendingTemplate(issue, user);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de code review:", error);
    return false;
  }
}

export async function sendCodeReviewValidatedEvent(
  issue: any,
  user: IGitlabUser
): Promise<boolean> {
  try {
    const template = createMergeRequestValidatedTemplate(issue, user);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de merge request:", error);
    return false;
  }
}

export async function sendCodeReviewFailEvent(
  issue: any,
  user: IGitlabUser
): Promise<boolean> {
  try {
    const template = createMergeRequestFailTemplate(issue, user);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de merge request:", error);
    return false;
  }
}

export async function sendCodeReviewFixedEvent(
  issue: any,
  user: IGitlabUser
): Promise<boolean> {
  try {
    const template = createMergeRequestFixedTemplate(issue, user);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de merge request:", error);
    return false;
  }
}

export async function sendCodeReviewHotfixEvent(
  issue: any,
  user: IGitlabUser
): Promise<boolean> {
  try {
    const template = createCodeReviewHotfixTemplate(issue, user);
    await sendTeamsNotification(config.codeReviewWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de code review:", error);
    return false;
  }
}

export async function sendHoftixEvent(issue: any): Promise<boolean> {
  try {
    const template = createHotfixTemplate(issue);
    await sendTeamsNotification(config.hotfixWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de hotfix:", error);
    return false;
  }
}

export async function sendDeployEvent(
  issue: any,
  user: IGitlabUser
): Promise<boolean> {
  try {
    const template = createDeployIssueTemplate(issue, user);
    await sendTeamsNotification(config.deployWebhookUrl, template);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de deploy:", error);
    return false;
  }
}
