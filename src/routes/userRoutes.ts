

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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
 *       '400':
 *         description: Requisição inválida
 *       '500':
 *         description: Erro do servidor
 */
router.post('/', userController.store);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro do servidor
 */
router.get('/:id', userController.show);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Usuário excluído com sucesso
 *       '404':
 *         description: Usuário não encontrado
 *       '400':
 *         description: Uuid inválido
 *       '500':
 *         description: Erro do servidor
 */
router.delete('/:id', userController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         zipcode:
 *           type: string
 *       minProperties: 1
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso
 *       '400':
 *         description: Requisição inválida
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro do servidor
 */

router.put('/:id', userController.update);



export default router;