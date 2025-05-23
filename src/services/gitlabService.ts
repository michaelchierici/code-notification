import { ILabel } from "../types/gitlab";

export const hasCodeReviewLabel = (labels: ILabel[]): boolean => {
  return labels.some(label => label.title === "codereview::pending");
};