import * as dotenv from "dotenv";
import { z } from "zod";
import { logger } from "../utils/logger"

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional().default("3000"),
  TEAMS_WEBHOOK_URL: z.string().url({
    message: "TEAMS_WEBHOOK_URL must be a valid URL"
  }),
  GITLAB_SECRET_TOKEN: z.string().min(1, {
    message: "GITLAB_SECRET_TOKEN is required"
  })
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error("❌ Invalid environment variables:");
    result.error.errors.forEach(error => {
      logger.error(`  - ${error.path}: ${error.message}`);
    });
    process.exit(1);
  }

  return result.data;
}

const env = validateEnv();

export const config = {
  port: parseInt(env.PORT, 10) || 3000,
  teamsWebhookUrl: env.TEAMS_WEBHOOK_URL,
  gitlabSecretToken: env.GITLAB_SECRET_TOKEN,
};

export type Config = typeof config;