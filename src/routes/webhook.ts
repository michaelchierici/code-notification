import { Router } from "express";
import { handleGitLabWebhook } from "../controllers/webhookController";
import { validateGitLabToken } from "../middleware/validateGitLabToken";

const router = Router();

router.post("/gitlab-webhook", validateGitLabToken, handleGitLabWebhook);

export default router;