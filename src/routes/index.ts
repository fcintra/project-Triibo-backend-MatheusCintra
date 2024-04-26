// routes/index.ts

import express from 'express';
import userRoutes from './userRoutes';


const router = express.Router();

router.use('/v1/users', userRoutes);


export default router;