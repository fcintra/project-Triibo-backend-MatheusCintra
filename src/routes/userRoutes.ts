

import express from 'express';
import UserController from '../controllers/UserController';

const userController = new UserController()

const router = express.Router();

router.get('/', userController.index);
router.post('/', userController.store);
router.get('/:id', userController.show);
router.delete('/:id', userController.delete);
router.put('/:id', userController.update);



export default router;