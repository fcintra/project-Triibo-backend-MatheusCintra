import * as path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentação da API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [path.resolve(__dirname, './src/routes/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
