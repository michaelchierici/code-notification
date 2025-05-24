import { IGitlabUser } from "../types/gitlab";
import { ITeamsWebhookPayload, ITextBlock } from "../types/teams";

const baseTemplate = {
  type: "message" as const,
  attachments: [
    {
      contentType: "application/vnd.microsoft.card.adaptive" as const,
      content: {
        type: "AdaptiveCard" as const,
        version: "1.4",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        body: [],
      },
    },
  ],
};

const generateTemplate = (body: ITextBlock[]): ITeamsWebhookPayload => {
  return {
    ...baseTemplate,
    attachments: [
      {
        ...baseTemplate.attachments[0],
        content: {
          ...baseTemplate.attachments[0].content,
          body: [...body],
        },
      },
    ],
  };
};

export const createCodeReviewPendingTemplate = (
  issue: any,
  user: IGitlabUser
): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      color: "Warning",
      text: "🚀 Novo pedido de *Code Review*",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `👤 ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};

export const createCodeReviewHotfixTemplate = (
  issue: any,
  user: IGitlabUser
): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      color: "Default",
      text: "@todos",
    },
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      color: "Attention",
      text: "⚠ HOTFIX -  Novo pedido de *Code Review* ⚠",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `👤 ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};

export const createMergeRequestValidatedTemplate = (
  issue: any,
  user: IGitlabUser
): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      color: "Good",
      text: "✅ Merge Request aprovado",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `*Author*: ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `*Revisor*: ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};

export const createMergeRequestFailTemplate = (
  issue: any,
  user: IGitlabUser
): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      color: "Attention",
      text: "❌ Merge Request recusado",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `*Author*: ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `*Revisor*: ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};

export const createMergeRequestFixedTemplate = (
  issue: any,
  user: IGitlabUser
): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      color: "Attention",
      text: "🔧 Correções realizadas no Merge Request",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `*Author*: ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `*Revisor*: ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};

export const createHotfixTemplate = (issue: any): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      color: "Default",
      text: "@todos",
    },
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      text: "⚠ HOTFIX em aberto ⚠",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};

export const createDeployIssueTemplate = (
  issue: any,
  user: IGitlabUser
): ITeamsWebhookPayload => {
  const template: ITextBlock[] = [
    {
      type: "TextBlock",
      size: "Large",
      weight: "Bolder",
      text: "🚀 Disponível para deploy",
    },
    {
      type: "TextBlock",
      weight: "Bolder",
      text: `📝 ${issue.title} (#${issue.iid})`,
      wrap: true,
    },
    {
      type: "TextBlock",
      color: "Default",
      text: `👤 ${user.name} (${user.username})`,
    },
    {
      type: "TextBlock",
      color: "Accent",
      text: `[🔗 Abrir issue](${issue.url})`,
    },
  ];

  return generateTemplate(template);
};
