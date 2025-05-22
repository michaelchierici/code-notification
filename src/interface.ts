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

export interface ILabel {
  id: number;
  title: string;
  color: string;
  project_id: number | null;
  created_at: string;
  updated_at: string;
  template: boolean;
  description: string | null;
  type: string;
  group_id: number;
}
