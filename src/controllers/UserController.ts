

import { Request, Response } from 'express';
import { z } from 'zod';
import UserService from '../services/UserService';

const userService = new UserService()

class UserController {
  public async index(req: Request, res: Response) {        
    res.status(200).json({ error: 'success' }); 
  }

  public async show(req: Request, res: Response){
  
  }

  public async store(req: Request, res: Response) {
    const userData = req.body;

    const userSchema = z.object({
      email: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      }).email(),
      password: z.string({
        required_error: "password is required",
        invalid_type_error: "password must be a string with eight or more characters",
      }).min(8),
      firstName: z.string({
        required_error: "first name is required",
        invalid_type_error: "first name must be a string with max thirty characters",
      }).max(30),
      lastName: z.string({
        required_error: "last name is required",
        invalid_type_error: "last name must be a string with max fifty characters",
      }).max(50),
      zipcode: z.string().max(8).optional(),
    });

    const validationResult = userSchema.safeParse(userData);


    if(validationResult.error){
      console.error('Erro de validação:', validationResult.error.issues);
      return res.json(validationResult.error.format())
    }
    

    try{
      const responseCreateUser = userService.createUser(userData)
      return res.status(201).json(responseCreateUser)
    }catch(e: any){
      return res.json('Não foi possivel cadastrar usuário')
    }
  }

  public async update(req: Request, res: Response){
   
  }

  public async delete(req: Request, res: Response) {
  }
}

export default UserController;