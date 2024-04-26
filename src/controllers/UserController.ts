


import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { z } from 'zod';
import UserService from '../services/UserService';
import HttpStatusCode from '../utils/statusCodeEnum';
import { validateUserData } from '../utils/validateUserData';

const userService = new UserService();

const idSchema = z.string().uuid(); 

class UserController {

  public async index(req: Request, res: Response) {        
    try {
      const users = await userService.getUsers();
      res.json(users); 
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' }); 
    }
  }

  public async show(req: Request, res: Response){    
    const { id } = req.params;
    const validationUserId = idSchema.safeParse(id);

    if(validationUserId.error){
      console.error('Erro de validação:', validationUserId.error.issues);
      return res.status(HttpStatusCode.BadRequest).json(validationUserId.error.format())
    }
    
    try {
        const existingUser = await userService.getUserById(id);
        if (!existingUser) {
          return res.status(HttpStatusCode.BadRequest).json({ error: 'Usuário não encontrado' });
        }

        res.json(existingUser); 
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' }); 
    }
  }

  public async store(req: Request, res: Response) {
    const userData = req.body;

    const validationResult = validateUserData(userData);

    if(validationResult.error){
      console.error('Erro de validação:', validationResult.error.issues);
      return res.json(validationResult.error.format())
    }

    const {zipcode, ...userDataWithoutZipcode} = userData

    try{
      const hashedPassword = await bcrypt.hash(userDataWithoutZipcode.password, 10);
      userDataWithoutZipcode.password = hashedPassword;

      const responseCreateUser = await userService.createUser(userDataWithoutZipcode, zipcode);

      return res.status(HttpStatusCode.Created).json(responseCreateUser)
    }catch(error){
      if (error instanceof Error) {
        return res.status(HttpStatusCode.BadRequest).json({ error: error.message })
      } else {
          return res.status(HttpStatusCode.BadRequest).json({ message: 'Não foi possível cadastrar usuário', error: 'Erro desconhecido' })
      }
    }
  }

  public async update(req: Request, res: Response){
    const { id } = req.params;
    const userData = req.body;
    
    const validationUserId = idSchema.safeParse(id);

    const validationResult = validateUserData(userData);

    if(validationUserId.error){
      console.error('Erro de validação:', validationUserId.error.issues);
      return res.status(HttpStatusCode.BadRequest).json(validationUserId.error.format())
    }

    const {zipcode, ...userDataWithoutZipcode} = userData;

    if(validationResult.error){
        console.error('Validation Error:', validationResult.error.issues);
        return res.status(HttpStatusCode.BadRequest).json(validationResult.error.format());
    }

    try {
        const hashedPassword = await bcrypt.hash(userDataWithoutZipcode.password, 10);
        userDataWithoutZipcode.password = hashedPassword;

        const responseUpdateUser = await userService.updateUser(id, userDataWithoutZipcode, zipcode);
        return res.status(HttpStatusCode.OK).json(responseUpdateUser);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(HttpStatusCode.BadRequest).json({ error: error.message });
        } else {
            return res.status(HttpStatusCode.BadRequest).json({ message: 'Could not update user', error: 'Unknown error' });
        }
    }
  }


  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const validationUserId = idSchema.safeParse(id);

    if(validationUserId.error){
      console.error('Erro de validação:', validationUserId.error.issues);
      return res.status(HttpStatusCode.BadRequest).json(validationUserId.error.format())
    }


    try {
      await userService.deleteUser(id);
      return res.status(HttpStatusCode.NoContent).json({});

    } catch (error) {
      if (error instanceof Error) {
          return res.status(HttpStatusCode.NotFound).json({ error: error.message });
      } else {
          return res.status(HttpStatusCode.BadRequest).json({ message: 'Could not delete user', error: 'Unknown error' });
      }
    }
  }
}

export default UserController;