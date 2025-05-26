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
