

import express from 'express';
import LoginController from '../controllers/LoginController';
import UserController from '../controllers/UserController';
import authenticateToken from '../middlewares/authMiddleware';

const userController = new UserController();
const loginController = new LoginController();


const router = express.Router();

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Erro do servidor
 *     security:
 *       - bearerAuth: []
 */
router.get('/', userController.index);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: Primeiro nome do usuário
 *         lastName:
 *           type: string
 *           description: Sobrenome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *         zipcode:
 *           type: string
 *           description: CEP do usuário (opcional)
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
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
 * /v1/users/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       '200':
 *         description: Login bem-sucedido. Retorna um token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authToken:
 *                   type: string
 *                   description: Token JWT de autenticação
 *       '401':
 *         description: Credenciais inválidas. O email ou senha fornecidos estão incorretos.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/login', loginController.login);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT de autenticação
 *         example: Bearer {seu-token-jwt}
 *     responses:
 *       '200':
 *         description: OK
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro do servidor
 *       '401':
 *         description: Não autorizado. Token JWT ausente ou inválido.
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticateToken, userController.show);


/**
 * @swagger
 * /v1/users/{id}:
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
 *       '401':
 *         description: Não autorizado. Token JWT ausente ou inválido.
 *       '500':
 *         description: Erro do servidor
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, userController.delete);

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
 * /v1/users/{id}:
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
 *       '401':
 *         description: Não autorizado. Token JWT ausente ou inválido.
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateToken, userController.update);



export default router;