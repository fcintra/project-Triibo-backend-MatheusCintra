import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { validateUserData } from '../../utils/validateUserData';




const UserService = require('../../services/UserService'); 
const UserController = require('../../controllers/UserController'); 

jest.mock('../../services/UserService');



describe('UserController', () => {
  let request: Request;
  let response: Response;

  beforeEach(() => {
    request = {} as Request;
    response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('index method', () => {
    it('should return a list of users', async () => {
      const users = [
        {
          id: "7317b0d4-6469-4f9b-b5c9-c1f15ce9e445",
          email: "math.teste@teste.com",
          password: "12345678",
          firstName: "matheus",
          lastName: "Teste",
          createdAt: "2024-04-24T18:47:47.165Z",
          updatedAt: "2024-04-24T18:47:47.165Z",
          UserAddress: []
        },
        {
          id: "df625e06-299b-4300-b19b-7d1fe9ef5799",
          email: "math.teste1@teste.com",
          password: "12345678",
          firstName: "matheus",
          lastName: "Teste",
          createdAt: "2024-04-24T18:50:33.065Z",
          updatedAt: "2024-04-24T18:50:33.065Z",
          UserAddress: []
        },
      ];

      UserService.getUsers.mockResolvedValue(users);

      await UserController.index(request, response);

      expect(UserService.getUsers).toHaveBeenCalledWith();
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors and return a 404 status', async () => {
      const error = new Error('Internal Server Error');

      UserService.getUsers.mockRejectedValue(error);

      await UserController.index(request, response);

      expect(UserService.getUsers).toHaveBeenCalledWith();
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  
  describe('show method', () => {
    it('should return a user by ID', async () => {
      const userId = '910bf7c5-0f98-4ebf-b286-2e8fbc12521b';
      const user = [{
        id: "910bf7c5-0f98-4ebf-b286-2e8fbc12521b",
        email: "math.test212111111111111111111134@teste.com",
        password: "$2b$10$1ibywQCYFiywZFNsBW4aWOm20dC4qS3F1G/P2QYcEh8ReYiJp67D6",
        firstName: "matheus",
        lastName: "Teste",
        createdAt: "2024-04-26T21:59:26.497Z",
        updatedAt: "2024-04-26T21:59:26.497Z",
        UserAddress: [
          {
            id: "fe1655ad-37c3-49fe-8190-dd4dbad5c930",
            userId: "910bf7c5-0f98-4ebf-b286-2e8fbc12521b",
            zipcode: "04950-015",
            street: "Rua Luís Baralis",
            complement: "",
            neighborhood: "Cidade Ipava",
            city: "São Paulo",
            state: "SP",
            createdAt: "2024-04-26T21:59:26.954Z",
            updatedAt: "2024-04-26T21:59:26.954Z"
          }
        ]
      }];
      
      UserService.getUserById.mockResolvedValue(user);
      request.params = { id: userId };

      await UserController.show(request, response);

      expect(UserService.getUserById).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(expect.objectContaining(user));
    });

    it('should handle user not found and return a 400 status', async () => {
      const userId = '31b71638-ed39-439b-b64c-bd9d41559136';
      UserService.getUserById.mockResolvedValue(null);
      request.params = { id: userId };

      await UserController.show(request, response);

      expect(UserService.getUserById).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'User not found!' });
    });

    it('should handle errors and return a 500 status', async () => {
      const userId = '31b71638-ed39-439b-b64c-bd9d41559136';
      const error = new Error('Internal Server Error');
      UserService.getUserById.mockRejectedValue(error);
      request.params = { id: userId };

      await UserController.show(request, response);

      expect(UserService.getUserById).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({error: 'Internal Server Error'});
    });

    it('should return a 400 status if the provided ID is not a valid UUID', async () => {
      const userId = '12345'; 
      request.params = { id: userId}
      await UserController.show(request, response);
  
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
      expect(response.json).toHaveBeenCalledWith({ _errors: ['Invalid uuid'] });
    });
  });

  describe('store method', () => {
    it('should create a new user if the data is valid', async () => {
      const validUserData = {
          firstName: 'Matheus',
          lastName: 'Teste',
          email: 'teste@teste.com',
          password: '12345678',
      };
  
  
      const userCreatedReturn = {
          id: "7f965c4d-88ac-4747-ae70-90c1535d5aa2",
          email: "teste@teste.com",
          password: "12345678",
          firstName: "Matheus",
          lastName: "Teste",
          createdAt: "2024-04-27T04:19:29.897Z",
          updatedAt: "2024-04-27T04:19:29.897Z"
      };
      UserService.createUser.mockResolvedValue(userCreatedReturn);
  
      request.body = validUserData;
  
      await UserController.store(request, response);
  
  
  
      expect(UserService.createUser).toHaveBeenCalledWith(validUserData, undefined);
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Created);
      expect(response.json).toHaveBeenCalledWith(userCreatedReturn);
    });


    it('should return no errors for valid user data', () => {
      const userData = {
        email: 'teste@teste.com',
        password: '12345678',
        firstName: 'Matheus',
        lastName: 'Teste',
        zipcode: '12345678',
      };
  
      const validationResult = validateUserData(userData);
  
      expect(validationResult.success).toBe(true);
      expect(validationResult.error).toBe(undefined);
    });
  
    it('should return errors for invalid user data - validate 5 inputs: email, password, firstname, lastname, zipcode', () => {
      const userData = {
        email: 'invalidemail', // email inválido
        password: '1234', // senha muito curta
        firstName: '', // primeiro nome em branco
        lastName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', // sobrenome muito longo
        zipcode: '12345', // CEP com menos de 8 caracteres
      };
  
      const validationResult = validateUserData(userData);
  
      expect(validationResult.success).toBe(false);
      expect(validationResult.error).toBeDefined();
      expect(validationResult.error?.issues).toHaveLength(5); 
    });
  });

  describe('update method', () => {
    it('should successfully update an existing user and return status 200', async () => {
        const existingUser = {
          id: "7317b0d4-6469-4f9b-b5c9-c1f15ce9e445",
          firstName: 'user',
          lastName: 'teste',
          createdAt: "2024-02-18T23:02:49.368Z",
          updatedAt: "2024-02-18T23:02:49.368Z",
          email: "testemath2@teste.com",
          password: "1234556@",
        };
  
    
      const updatedUser = {
          ...existingUser,
          firstName: 'user',
          lastName: 'teste',
          email: 'updated@test.com',
          password: 'updated123',
          updatedAt: new Date(), 
      };

      UserService.updateUser.mockResolvedValue(updatedUser);

      request.params = { id: existingUser.id };
  
      request.body = {
          email: 'updated@test.com',
          firstName: 'user',
          lastName: 'teste',
          password: 'updated123',
      };
    
      await UserController.update(request, response);

      expect(UserService.updateUser).toHaveBeenCalledWith(
        request.params.id, 
        expect.objectContaining({
            firstName: 'user',
            lastName: 'teste',
            email: 'updated@test.com',
            password: 'updated123',
        }),
        undefined
      );
    
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('delete method', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete a user and return status 204', async () => {
      const userId = 'c4ce3407-f143-4b42-8d96-7c3dd88829e0'; 
      
      UserService.deleteUser.mockResolvedValueOnce();
      
      request.params = { id: userId}
      await UserController.delete(request, response);
  
      expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
      expect(response.json).toHaveBeenCalledWith({});
    });
  
    it('should return error when failed to delete user', async () => {
      const userId = 'c4ce3407-f143-4b42-8d96-7c3dd88829e0'; 
      const errorMessage = 'Internal Server Error';
      request.params = { id: userId}

      UserService.deleteUser.mockRejectedValueOnce(new Error(errorMessage));
  
      await UserController.delete(request, response);
  
      expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
      expect(response.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return error when user is not found', async () => {
      const userId = 'c4ce3407-f143-4b42-8d96-7c3dd88829e0'; 
      const errorMessage = 'User not found';
      request.params = { id: userId}

      UserService.deleteUser.mockRejectedValueOnce(new Error(errorMessage));
  
      await UserController.delete(request, response);  
      expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
      expect(response.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

});