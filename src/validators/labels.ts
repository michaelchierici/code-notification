import {
  sendCodeReviewFailEvent,
  sendCodeReviewFixedEvent,
  sendCodeReviewHotfixEvent,
  sendCodeReviewPendingEvent,
  sendCodeReviewValidatedEvent,
  sendHoftixEvent
} from "../events";
import { ILabel, LabelHandler, LabelTypes } from "../types/gitlab";


export const hasCodeReviewPendingAndDoneLabels = (
  labels: ILabel[]
): boolean => {
  const hasPending = labels.some(
    (label) => label.title === LabelTypes.CODE_REVIEW_PENDING
  );
  const hasDone = labels.some((label) => label.title === LabelTypes.DONE);
  return hasPending && hasDone;
};

export const hasCodeReviewValidatedAndDoneLabels = (
  labels: ILabel[]
): boolean => {
  const hasValidated = labels.some(
    (label) => label.title === LabelTypes.CODE_REVIEW_VALIDATED
  );
  const hasDone = labels.some((label) => label.title === LabelTypes.DONE);
  return hasValidated && hasDone;
};

export const hasCodeReviewFailLabel = (labels: ILabel[]): boolean => {
  return labels.some((label) => label.title === LabelTypes.CODE_REVIEW_FAIL);
};

export const hasCodeReviewFixedLabel = (labels: ILabel[]): boolean => {
  return labels.some((label) => label.title === LabelTypes.CODE_REVIEW_FIXED);
};

export const hasCodeReviewPendingHotfixLabels = (labels: ILabel[]): boolean => {
  const hasPending = labels.some(
    (label) => label.title === LabelTypes.CODE_REVIEW_PENDING
  );
  const hasHotfix = labels.some((label) => label.title === LabelTypes.HOTFIX);
  return hasPending && hasHotfix;
};

export const hasToDoAndHotfixLabels = (labels: ILabel[]): boolean => {
  const hasPending = labels.some((label) => label.title === LabelTypes.TO_DO);
  const hasHotfix = labels.some((label) => label.title === LabelTypes.HOTFIX);
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