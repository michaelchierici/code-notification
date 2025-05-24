declare namespace NodeJS {
  interface ProcessEnv {
    CODE_REVIEW_CHAT_WEBHOOK_URL: string
    HOTFIX_CHAT_WEBHOOK_URL: string
    DEPLOY_CHAT_WEBHOOK_URL: string
    GITLAB_SECRET_TOKEN: string
    NODE_ENV?: "development" | "production"
    PORT: string
  }
}
