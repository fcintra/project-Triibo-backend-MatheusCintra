

import express from 'express';
import UserController from '../controllers/UserController';

const userController = new UserController()

const router = express.Router();

router.get('/', userController.index);


export default router;