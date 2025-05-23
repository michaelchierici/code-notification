import { Request, Response } from 'express';
import { createCodeReviewCard } from '../templates/code-review';
import { hasCodeReviewLabel } from '../services/gitlabService';
import { handleGitLabWebhook } from './webhookController';
import { sendCodeReviewEvent } from '../events';


jest.mock('../templates/code-review', () => ({
  createCodeReviewCard: jest.fn(),
}));

jest.mock('../services/gitlabService', () => ({
  hasCodeReviewLabel: jest.fn(),
}));

jest.mock('../events', () => ({
  sendCodeReviewEvent: jest.fn()
}));

describe('WebhookController', () => {
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
      send: jest.fn().mockReturnThis()
    };

    mockResponse = responseObject;

    // Mock request with default values
    mockRequest = {
      body: {
        object_kind: 'issue',
        object_attributes: {
          "action": "update", "iid": 123, "title": "Test Issue", "url": "https://gitlab.com/test/project/-/issues/123"
        },

        labels: [{
          title: 'codereview::pending'
        }],
        user: {
          name: 'Test User',
          username: 'testuser'
        }
      }
    };
  });

  describe('handleGitLabWebhook', () => {
    it('should return 200 when event is not an issue update', async () => {
      // Arrange
      mockRequest.body.object_kind = 'merge_request';

      // Act
      await handleGitLabWebhook(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(responseObject.status).toHaveBeenCalledWith(200);
      expect(responseObject.send).toHaveBeenCalledWith('Evento recebido.');
      expect(hasCodeReviewLabel).not.toHaveBeenCalled();
      expect(sendCodeReviewEvent).not.toHaveBeenCalled();
    });

    it('should return 500 when event is an issue update but without code review label', async () => {
      // Arrange
      (hasCodeReviewLabel as jest.Mock).mockReturnValue(false);

      // Act
      await handleGitLabWebhook(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(hasCodeReviewLabel).toHaveBeenCalledWith(mockRequest.body.labels);
      expect(sendCodeReviewEvent).not.toHaveBeenCalled();
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.send).toHaveBeenCalledWith('Erro ao processar evento');
    });

    it('should send notification when issue has code review label', async () => {
      // Arrange
      (hasCodeReviewLabel as jest.Mock).mockReturnValue(true);
      const mockNotification = {
        type: 'message',
        content: 'test',
        name: "Test User",
        username: "testuser",
      };
      (createCodeReviewCard as jest.Mock).mockReturnValue(mockNotification);
      (sendCodeReviewEvent as jest.Mock).mockResolvedValue(true);

      // Act
      await handleGitLabWebhook(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(hasCodeReviewLabel).toHaveBeenCalledWith(mockRequest.body.labels);

      expect(sendCodeReviewEvent).toHaveBeenCalledWith(mockRequest.body.object_attributes, mockRequest.body.user);
      expect(responseObject.status).toHaveBeenCalledWith(200);
      expect(responseObject.send).toHaveBeenCalledWith('Evento processado com sucesso');
    });

    it('should return 500 when Teams notification fails', async () => {
      // Arrange
      (hasCodeReviewLabel as jest.Mock).mockReturnValue(true);
      (createCodeReviewCard as jest.Mock).mockReturnValue({});
      (sendCodeReviewEvent as jest.Mock).mockResolvedValue(false);

      // Act
      await handleGitLabWebhook(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendCodeReviewEvent).toHaveBeenCalled();
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.send).toHaveBeenCalledWith('Erro ao processar evento');
    });

    it('should handle missing properties in the webhook payload', async () => {
      // Arrange
      mockRequest.body = {
        object_kind: 'issue'
        // Missing other properties
      };

      // Act
      await handleGitLabWebhook(mockRequest as Request, mockResponse as Response);

      // Assert
      // Should not crash and return a reasonable response
      expect(responseObject.status).toHaveBeenCalled();
      expect(responseObject.send).toHaveBeenCalled();
      expect(hasCodeReviewLabel).not.toHaveBeenCalled();
    });
  });
});