

import { Request, Response } from 'express';


class UserController {
  public async index(req: Request, res: Response) {        
    res.status(200).json({ error: 'success' }); 
  }

  public async show(req: Request, res: Response){
  
  }

  public async store(req: Request, res: Response) {
    
  }

  public async update(req: Request, res: Response){
   
  }

  public async delete(req: Request, res: Response) {
  }
}

export default UserController;