import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
const LoginController = require('../LoginController');
const AuthService = require('../../services/AuthService');

jest.mock('../../services/AuthService');

describe('LoginController', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
  
    beforeEach(() => {
      request = {
        body: {
          email: 'user@example.com',
          password: 'password123'
        }
      };
      response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
  
    it('should return a JWT token when logging in with valid credentials', async () => {
      AuthService.login.mockResolvedValue('mockAuthToken');
  
      await LoginController.login(request, response);
  
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Created);
      expect(response.json).toHaveBeenCalledWith({ authToken: 'mockAuthToken' });
    });
  
    it('should return an error when login fails', async () => {
      AuthService.login.mockResolvedValue(null);
  
      await LoginController.login(request, response);
  
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
      expect(response.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });
  
    it('should return an error when an internal server error occurs', async () => {
      AuthService.login.mockRejectedValue(new Error('Some internal error'));
  
      await LoginController.login(request, response);
  
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
      expect(response.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
  });
  