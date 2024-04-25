


import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { z } from 'zod';
import UserService from '../services/UserService';

const userService = new UserService();

const idSchema = z.string().uuid(); 

class UserController {
  public async index(req: Request, res: Response) {        
    try {
      const users = await userService.getUsers();
      res.json(users); 
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
  }

  public async show(req: Request, res: Response){
    const {id} = req.params;
    idSchema.parse(id);
    try {
        const existingUser = await userService.getUserById(id);
        if (!existingUser) {
          return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        res.json(existingUser); 
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
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

    const {zipcode, ...userDataWithoutZipcode} = userData


    if(validationResult.error){
      console.error('Erro de validação:', validationResult.error.issues);
      return res.json(validationResult.error.format())
    }


    try{
      const hashedPassword = await bcrypt.hash(userDataWithoutZipcode.password, 10);
      userDataWithoutZipcode.password = hashedPassword;

      const responseCreateUser = await userService.createUser(userDataWithoutZipcode, zipcode)
      return res.status(201).json(responseCreateUser)
    }catch(error){
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      } else {
          return res.status(400).json({ message: 'Não foi possível cadastrar usuário', error: 'Erro desconhecido' })
      }
    }
  }

  public async update(req: Request, res: Response){
    const { id } = req.params;
    const userData = req.body;
    const validationUserId = idSchema.safeParse(id);

    if(validationUserId.error){
      console.error('Erro de validação:', validationUserId.error.issues);
      return res.json(validationUserId.error.format())
    }

    const userSchema = z.object({
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a valid email address",
        }).email().max(50).optional(),
        password: z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string with at least eight characters",
        }).min(8).optional(),
        firstName: z.string({
            required_error: "First name is required",
            invalid_type_error: "First name must be a string with maximum thirty characters",
        }).max(30).optional(),
        lastName: z.string({
            required_error: "Last name is required",
            invalid_type_error: "Last name must be a string with maximum fifty characters",
        }).max(50).optional(),
        zipcode: z.string().max(8).optional(),
    });

    const validationResult = userSchema.safeParse(userData);

    const {zipcode, ...userDataWithoutZipcode} = userData;

    if(validationResult.error){
        console.error('Validation Error:', validationResult.error.issues);
        return res.status(400).json(validationResult.error.format());
    }

    try {
        const hashedPassword = await bcrypt.hash(userDataWithoutZipcode.password, 10);
        userDataWithoutZipcode.password = hashedPassword;

        const responseUpdateUser = await userService.updateUser(id, userDataWithoutZipcode, zipcode);
        return res.status(200).json(responseUpdateUser);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(400).json({ message: 'Could not update user', error: 'Unknown error' });
        }
    }
  }


  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const validationUserId = idSchema.safeParse(id);

    if(validationUserId.error){
      console.error('Erro de validação:', validationUserId.error.issues);
      return res.json(validationUserId.error.format())
    }


    try {
      await userService.deleteUser(id);
      return res.status(204).json({});
    } catch (error) {
      if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
      } else {
          return res.status(400).json({ message: 'Could not delete user', error: 'Unknown error' });
      }
    }
  }
}

export default UserController;