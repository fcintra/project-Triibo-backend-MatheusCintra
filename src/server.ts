
import express from 'express';
import { prisma } from '../src/lib/prisma';


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

prisma.$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    // emitindo um erro se não for possível conectar ao banco de dados
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  });


  app.get('/test', (req, res) => {
    res.send('Hello, world! This is a test endpoint.');
  });