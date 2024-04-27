import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { HttpStatusCode } from 'axios';

const authService = new AuthService();

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
            console.error('Erro ao fazer login:', error);
            res.status(HttpStatusCode.InternalServerError).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default LoginController;
