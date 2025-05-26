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

export const hasCodeReviewPendingAndDoneLabels = (
  labels: ILabel[]
): boolean => {
  const hasPending = labels.some(
    (label) => label.title === "codereview::pending"
  );
  const hasDone = labels.some((label) => label.title === "Done");
  return hasPending && hasDone;
};

export const hasCodeReviewValidatedAndDoneLabels = (
  labels: ILabel[]
): boolean => {
  const hasValidated = labels.some(
    (label) => label.title === "codereview::validated"
  );
  const hasDone = labels.some((label) => label.title === "Done");
  const hasTestLabels = labels.some(
    (label) =>
      label.title === "Test fail" ||
      label.title === "Test ok" ||
      label.title === "Test revised"
  );
  return hasValidated && hasDone && !hasTestLabels;
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


export const hasToDoAndHotfixLabels = (labels: ILabel[]): boolean => {
  const hasPending = labels.some((label) => label.title === "To do");
  const hasHotfix = labels.some((label) => label.title === "Hotfix");
  return hasPending && hasHotfix;
};

export const labelHandlers: LabelHandler[] = [
  {
    check: hasCodeReviewPendingHotfixLabels,
    handle: (issue, assignees) => sendCodeReviewHotfixEvent(issue, assignees),
  },
  {
    check: hasCodeReviewPendingAndDoneLabels,
    handle: (issue, assignees) => sendCodeReviewPendingEvent(issue, assignees),
  },
  {
    check: hasCodeReviewValidatedAndDoneLabels,
    handle: (issue, assignees, revisor) => sendCodeReviewValidatedEvent(issue, assignees, revisor!),
  },
  {
    check: hasCodeReviewFailLabel,
    handle: (issue, assignees, revisor) => sendCodeReviewFailEvent(issue, assignees, revisor!),
  },
  {
    check: hasCodeReviewFixedLabel,
    handle: (issue, assignees) => sendCodeReviewFixedEvent(issue, assignees),
  },
  {
    check: hasToDoAndHotfixLabels,
    handle: (issue) => sendHoftixEvent(issue),
  },
];
