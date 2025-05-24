import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const validateGitLabToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-gitlab-token"];

  if (token !== config.gitlabSecretToken) {
    return res.status(403).send("Token inválido");
  }

  next();
};