import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
const authService = require('../services/AuthService');


const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT secret not found in environment variables');
}

class LoginController {
    public async login(req: Request, res: Response): Promise<string | void> {
        const { email, password } = req.body;

        try {
            const authToken = await authService.login(email, password);
            if (!authToken) {
                res.status(HttpStatusCode.Unauthorized).json({ error: 'Credenciais inválidas' });
                return;
            }
            res.status(HttpStatusCode.Created).json({ authToken });

        } catch (error) {
            res.status(HttpStatusCode.InternalServerError).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new LoginController();