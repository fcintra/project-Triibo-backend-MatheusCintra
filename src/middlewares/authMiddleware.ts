import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret: string = process.env.JWT_SECRET || 'jwtsupersecret';

export default function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    console.log(authHeader, token)

    if (!token) {
        return res.status(HttpStatusCode.Unauthorized).json({ error: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (err.message === 'jwt expired') {
                return res.status(HttpStatusCode.Forbidden).json({ error: 'Faça o login novamente' });
            }
            return res.status(HttpStatusCode.Forbidden).json({ error: 'Token de autenticação inválido' });
        }
        req.userId = (decoded as { userId: string }).userId;
        next(); 
    });
}
