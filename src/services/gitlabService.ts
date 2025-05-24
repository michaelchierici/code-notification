import { ILabel } from "../types/gitlab";

export const hasCodeReviewPendingLabel = (labels: ILabel[]): boolean => {
  return labels.some((label) => label.title === "codereview::pending");
};

export const hasCodeReviewValidatedLabel = (labels: ILabel[]): boolean => {
  return labels.some((label) => label.title === "codereview::validated");
};

export const hasCodeReviewFailLabel = (labels: ILabel[]): boolean => {
  return labels.some((label) => label.title === "codereview::fail");
};

export const hasCodeReviewFixedLabel = (labels: ILabel[]): boolean => {
  return labels.some((label) => label.title === "codereview::fixed");
};

export const hasCodeReviewPendingHotfixLabel = (labels: ILabel[]): boolean => {
  const hasPending = labels.some(
    (label) => label.title === "codereview::pending"
  );
  const hasHotfix = labels.some((label) => label.title === "Hotfix");
  return hasPending && hasHotfix;
};

export const hasCodeReviewValidatedAndDoneLabel = (
  labels: ILabel[]
): boolean => {
  const hasPending = labels.some(
    (label) => label.title === "codereview::validated"
  );
  const hasHotfix = labels.some((label) => label.title === "Done");
  return hasPending && hasHotfix;
};

export const hasHotfixLabel = (labels: ILabel[]): boolean => {
  const hasPending = labels.some((label) => label.title === "To do");
  const hasHotfix = labels.some((label) => label.title === "Hotfix");
  return hasPending && hasHotfix;
};
