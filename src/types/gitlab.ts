export interface ILabel {
  id: number;
  title:
  | "To do"
  | "Bugfix"
  | "Critical"
  | "Hotfix"
  | "Done"
  | "codereview::pending"
  | "codereview::validated"
  | "codereview::fail"
  | "codereview::fixed"
  | "Ready to test"
  | "Test ok"
  | "Test fail"
  | "Test revised";
  color: string;
  project_id: number | null;
  created_at: string;
  updated_at: string;
  template: boolean;
  description: string | null;
  type: string;
  group_id: number;
}

export interface IGitlabAssignee {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email: string;
}

export type LabelHandler = {
  check: (labels: any[]) => boolean;
  handle: (issue: any, assignees: IGitlabAssignee[], user?: IGitlabAssignee) => Promise<boolean>;
};

export enum EventTypes {
  ISSUE = 'issue',
  UPDATE = 'update',
  TEST_ENVIRONMENT_PREFIX = 'Ambiente de testes::',
  READY_TO_TEST = 'Ready to test',
  QA_USER = 'qa.interno'
}

export enum LabelTypes {
  CODE_REVIEW_PENDING = "codereview::pending",
  CODE_REVIEW_VALIDATED = "codereview::validated",
  CODE_REVIEW_FAIL = "codereview::fail",
  CODE_REVIEW_FIXED = "codereview::fixed",
  DONE = "Done",
  HOTFIX = "Hotfix",
  TO_DO = "To do"
}
