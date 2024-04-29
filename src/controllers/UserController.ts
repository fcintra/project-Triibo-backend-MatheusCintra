


import { Request, Response } from 'express';
import { z } from 'zod';
const UserService = require('../services/UserService');

import { HttpStatusCode } from 'axios';
import { validateUserData } from '../utils/validateUserData';


const idSchema = z.string().uuid(); 


class UserController {

  public async index(req: Request, res: Response) {        
    try {
      const users = await UserService.getUsers();
      res.status(HttpStatusCode.Ok).json(users); 
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' }); 
    }
  }

  public async show(req: Request, res: Response){    
    const { id } = req.params;
    const validationUserId = idSchema.safeParse(id);

    if(validationUserId.error){
      return res.status(HttpStatusCode.BadRequest).json(validationUserId.error.format())
    }
    
    try {
        const existingUser = await UserService.getUserById(id);
        if (!existingUser) {
          return res.status(HttpStatusCode.NotFound).json({ error: 'User not found!' });
        }

        res.status(HttpStatusCode.Ok).json(existingUser); 
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' }); 
    }
  }

  public async store(req: Request, res: Response) {
    const userData = req.body;

    const validationResult = validateUserData(userData);

    if(validationResult.error){
      return res.status(HttpStatusCode.BadRequest).json(validationResult.error.format())
    }

    const {zipcode, ...userDataWithoutZipcode} = userData

    try{
      const responseCreateUser = await UserService.createUser(userDataWithoutZipcode, zipcode);

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
      return res.status(HttpStatusCode.BadRequest).json(validationUserId.error.format())
    }

    if(validationResult.error){
      return res.status(HttpStatusCode.BadRequest).json(validationResult.error.format());
    }

    const {zipcode, ...userDataWithoutZipcode} = userData;
    
    try {
        const responseUpdateUser = await UserService.updateUser(id, userDataWithoutZipcode, zipcode);
        return res.status(HttpStatusCode.Ok).json(responseUpdateUser);
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
      await UserService.deleteUser(id);
      return res.status(HttpStatusCode.NoContent).json({});
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return res.status(HttpStatusCode.NotFound).json({ error: 'User not found' });
      } 
      return res.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
      
    }
  }

}

module.exports = new UserController();