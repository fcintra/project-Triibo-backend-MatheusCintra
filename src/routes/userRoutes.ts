

import express from 'express';
import UserController from '../controllers/UserController';

const userController = new UserController()

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Erro do servidor
 */
router.get('/', userController.index);


router.post('/', userController.store);
router.get('/:id', userController.show);
router.delete('/:id', userController.delete);
router.put('/:id', userController.update);



export default router;