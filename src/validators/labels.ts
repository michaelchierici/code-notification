import {
  sendCodeReviewFailEvent,
  sendCodeReviewFixedEvent,
  sendCodeReviewHotfixEvent,
  sendCodeReviewPendingEvent,
  sendCodeReviewValidatedEvent,
  sendDeployEvent,
  sendHoftixEvent,
} from "../events";
import { ILabel, LabelHandler } from "../types/gitlab";

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

export const hasCodeReviewPendingHotfixLabels = (labels: ILabel[]): boolean => {
  const hasPending = labels.some(
    (label) => label.title === "codereview::pending"
  );
  const hasHotfix = labels.some((label) => label.title === "Hotfix");
  return hasPending && hasHotfix;
};

export const hasCodeReviewValidatedAndDoneLabels = (
  labels: ILabel[]
): boolean => {
  const hasPending = labels.some(
    (label) => label.title === "codereview::validated"
  );
  const hasHotfix = labels.some((label) => label.title === "Done");
  return hasPending && hasHotfix;
};

export const hasToDoAndHotfixLabels = (labels: ILabel[]): boolean => {
  const hasPending = labels.some((label) => label.title === "To do");
  const hasHotfix = labels.some((label) => label.title === "Hotfix");
  return hasPending && hasHotfix;
};

export const labelHandlers: LabelHandler[] = [
  {
    check: hasCodeReviewPendingHotfixLabels,
    handle: (issue, user) => sendCodeReviewHotfixEvent(issue, user),
  },
  {
    check: hasCodeReviewPendingLabel,
    handle: (issue, user) => sendCodeReviewPendingEvent(issue, user),
  },
  {
    check: hasCodeReviewValidatedLabel,
    handle: (issue, user) => sendCodeReviewValidatedEvent(issue, user),
  },
  {
    check: hasCodeReviewFailLabel,
    handle: (issue, user) => sendCodeReviewFailEvent(issue, user),
  },
  {
    check: hasCodeReviewFixedLabel,
    handle: (issue, user) => sendCodeReviewFixedEvent(issue, user),
  },
  {
    check: hasCodeReviewValidatedAndDoneLabels,
    handle: (issue, user) => sendDeployEvent(issue, user),
  },
  {
    check: hasToDoAndHotfixLabels,
    handle: (issue) => sendHoftixEvent(issue),
  },
];
