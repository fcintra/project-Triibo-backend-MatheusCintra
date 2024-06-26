// auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userModel = require('../models/UserModel');

const jwtSecret: string = process.env.JWT_SECRET || 'jwtsupersecret';

if (!jwtSecret) {
    throw new Error('JWT secret not found in environment variables');
}

class AuthService {

    public async login(email: string, password: string): Promise<string | null> {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return null; 
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }

        const authToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        return authToken;
    }
}

module.exports = new AuthService();