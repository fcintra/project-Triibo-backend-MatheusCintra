
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { prisma } from '../src/lib/prisma';
import swaggerSpec from '../swaggerConfig';
import routes from './routes';


const app = express();
app.use(cors());

app.use(express.json());
app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 3001;

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
