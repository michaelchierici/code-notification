import { Request, Response } from "express";
import { handleGitLabWebhook } from "./webhookController";
import { hasCodeReviewPendingLabel } from "../services/gitlabService";
import { sendCodeReviewPendingEvent } from "../events";
import { createCodeReviewPendingTemplate } from "../templates";

jest.mock("../templates", () => ({
  createCodeReviewPendingTemplate: jest.fn(),
}));

jest.mock("../services/gitlabService", () => ({
  hasCodeReviewPendingLabel: jest.fn(),
}));

jest.mock("../events", () => ({
  sendCodeReviewPendingEvent: jest.fn(),
}));

describe("WebhookController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup response mock
    responseObject = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockResponse = responseObject;

    // Mock request with default values
    mockRequest = {
      body: {
        object_kind: "issue",
        object_attributes: {
          action: "update",
          iid: 123,
          title: "Test Issue",
          url: "https://gitlab.com/test/project/-/issues/123",
        },

        labels: [
          {
            title: "codereview::pending",
          },
        ],
        user: {
          name: "Test User",
          username: "testuser",
        },
      },
    };
  });

  describe("handleGitLabWebhook", () => {
    it("should return 200 when event is not an issue update", async () => {
      // Arrange
      mockRequest.body.object_kind = "merge_request";

      // Act
      await handleGitLabWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(responseObject.status).toHaveBeenCalledWith(200);
      expect(responseObject.send).toHaveBeenCalledWith("Evento recebido.");
      expect(hasCodeReviewPendingLabel).not.toHaveBeenCalled();
      expect(sendCodeReviewPendingEvent).not.toHaveBeenCalled();
    });

    it("should return 500 when event is an issue update but without code review label", async () => {
      // Arrange
      (hasCodeReviewPendingLabel as jest.Mock).mockReturnValue(false);

      // Act
      await handleGitLabWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(hasCodeReviewPendingLabel).toHaveBeenCalledWith(
        mockRequest.body.labels
      );
      expect(sendCodeReviewPendingEvent).not.toHaveBeenCalled();
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.send).toHaveBeenCalledWith(
        "Erro ao processar evento"
      );
    });

    it("should send notification when issue has code review label", async () => {
      // Arrange
      (hasCodeReviewPendingLabel as jest.Mock).mockReturnValue(true);
      const mockNotification = {
        type: "message",
        content: "test",
        name: "Test User",
        username: "testuser",
      };
      (createCodeReviewPendingTemplate as jest.Mock).mockReturnValue(
        mockNotification
      );
      (sendCodeReviewPendingEvent as jest.Mock).mockResolvedValue(true);

      // Act
      await handleGitLabWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(hasCodeReviewPendingLabel).toHaveBeenCalledWith(
        mockRequest.body.labels
      );

      expect(sendCodeReviewPendingEvent).toHaveBeenCalledWith(
        mockRequest.body.object_attributes,
        mockRequest.body.user
      );
      expect(responseObject.status).toHaveBeenCalledWith(200);
      expect(responseObject.send).toHaveBeenCalledWith(
        "Evento processado com sucesso"
      );
    });

    it("should return 500 when Teams notification fails", async () => {
      // Arrange
      (hasCodeReviewPendingLabel as jest.Mock).mockReturnValue(true);
      (createCodeReviewPendingTemplate as jest.Mock).mockReturnValue({});
      (sendCodeReviewPendingEvent as jest.Mock).mockResolvedValue(false);

      // Act
      await handleGitLabWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(sendCodeReviewPendingEvent).toHaveBeenCalled();
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.send).toHaveBeenCalledWith(
        "Erro ao processar evento"
      );
    });

    it("should handle missing properties in the webhook payload", async () => {
      // Arrange
      mockRequest.body = {
        object_kind: "issue",
        // Missing other properties
      };

      // Act
      await handleGitLabWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      // Should not crash and return a reasonable response
      expect(responseObject.status).toHaveBeenCalled();
      expect(responseObject.send).toHaveBeenCalled();
      expect(hasCodeReviewPendingLabel).not.toHaveBeenCalled();
    });
  });
});
