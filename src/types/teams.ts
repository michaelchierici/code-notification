interface ITextBlock {
  type: "TextBlock";
  size?: "Large" | "Medium" | "Small";
  weight?: "Bolder" | "bolder" | "normal";
  text: string;
  color?: "default" | "accent";
}

interface IAdaptiveCard {
  type: "AdaptiveCard";
  version: string;
  body: ITextBlock[];
  $schema: string;
}

interface IAttachment {
  contentType: "application/vnd.microsoft.card.adaptive";
  content: IAdaptiveCard;
}

export interface ITeamsWebhookPayload {
  type: "message";
  attachments: IAttachment[];
}