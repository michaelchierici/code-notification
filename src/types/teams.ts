export interface ITextBlock {
  type: "TextBlock";
  size?: "Large" | "Medium" | "Small";
  weight?: "Bolder" | "bolder" | "normal";
  horizontalAlignment?: "Center" | "Left" | "Right";
  color?:
    | "Default"
    | "Accent"
    | "Dark"
    | "Light"
    | "Warning"
    | "Attention"
    | "Good";
  text: string;
  wrap?: boolean;
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
