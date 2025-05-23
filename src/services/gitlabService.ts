import { ILabel } from "../types/gitlab";
import { ITeamsWebhookPayload } from "../types/teams";


export const createCodeReviewNotification = (
  issue: any,
  user: any
): ITeamsWebhookPayload => {
  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              size: "Large",
              weight: "Bolder",
              text: "🚀 Novo pedido de *Code Review*",
            },
            {
              type: "TextBlock",
              weight: "bolder",
              text: `📝 ${issue.title} (#${issue.iid})`,
            },
            {
              type: "TextBlock",
              color: "default",
              text: `👤 ${user.name} (${user.username})`,
            },
            {
              type: "TextBlock",
              color: "accent",
              text: `[🔗 Abrir issue](${issue.url})`,
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        },
      },
    ],
  };
};

export const hasCodeReviewLabel = (labels: ILabel[]): boolean => {
  return labels.some(label => label.title === "codereview::pending");
};