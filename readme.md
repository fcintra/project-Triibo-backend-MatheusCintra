
# Triibo - Backend - CRUD


Instruções para Iniciar a Aplicação

Este guia fornece instruções passo a passo para configurar e iniciar a aplicação. Certifique-se de seguir cada etapa cuidadosamente.

### Pré-requisitos

Antes de começar, verifique se você tem o [Node.js](https://nodejs.org), o [Yarn](https://yarnpkg.com) e o [Docker](https://www.docker.com) instalados em sua máquina.

### Instalação

1. Clone este repositório para o seu ambiente local:

```bash
git clone https://github.com/fcintra/project-Triibo-backend-MatheusCintra.git
```

2. Agora instale todas dependencias do projeto com:

```bash
yarn install
```

3. Configure o arquivo .env

Crie um arquivo .env na raiz do seu projeto e configure as informações do banco de dados conforme o exemplo abaixo:

```env
DATABASE_URL="postgresql://userApi:randompassword@localhost:5432/apiUser?schema=public"
PORT=3000
JWT_SECRET="superSecret"
```
Nota: Coloquei o .env assim pois é para um banco de dados local apenas (isso não pode ocorrer com banco de dados em produção).
Além disso, não se pode expor o jwt_secret e nem a porta desta forma.

4. Execute o Docker Compose

Abra o terminal na raiz do seu projeto e execute o seguinte comando para iniciar o contêiner Docker:

```bash
docker compose up -d
```
Nota: Certifique-se de que a porta 5432 está livre. Caso esteja em uso, pare a aplicação que a utiliza, libere a porta e execute novamente o Docker Compose.

5. Gere o Client do Prisma

```bash
npx prisma generate
```

6. Execute as Migrações

Com o contêiner em execução, execute as migrações para criar o banco de dados:

```bash
npx prisma migrate dev
```

7. Inicie o Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento com o seguinte comando:

```bash
yarn dev
```

8. Executando os testes

```bash
yarn test
```

Agora sua aplicação deve estar acessível em http://localhost:3000.


# Documentação da API

Para acessar a documentação da API, você pode visitar o seguinte URL em seu navegador:

http://localhost:3000/api-docs

O primeiro endpoint disponível em nossa API é:

http://localhost:3000/v1/users

### Exemplo de Corpo de Requisição

Você pode enviar uma solicitação POST com o seguinte corpo de exemplo para criar um novo usuário:

```bash
{
  "firstName": "Teste",
  "lastName": "testando",
  "email": "teste@teste.com.br",
  "password": "12345678",
  "zipcode": "01001-000"
}
```

## Autenticação

Após criar um usuário, você pode fazer login para obter um token de autenticação. O endpoint de login é:

http://localhost:3000/v1/users/login

### Corpo de Requisição para Login

Envie uma solicitação POST com o seguinte corpo de exemplo para fazer login:

```bash
{
  "email": "teste@teste.com.br",
  "password": "12345678"
}
```

Após o login bem-sucedido, um token JWT será gerado.

## Utilizando o Token JWT

Para acessar rotas protegidas que requerem autenticação, você deve incluir o token JWT no cabeçalho Authorization. Por exemplo:

```
Authorization: Bearer {TOKEN_JWT}
```

Se você estiver testando através do Swagger UI, clique no botão "Authorize" no canto superior direito, insira o token JWT gerado no campo "value" e clique em "Authorize" para aplicar o token. Pronto, agora você pode acessar os endpoints:

Retorna o usuário que possui o ID fornecido no parametro da URL
```
GET: http://localhost:3000/v1/users/{userId}
```

Retorna todos os usuários
```
GET: http://localhost:3000/v1/users
```

Deleta o usuário que possui o ID fornecido no parametro da URL
```
DELETE: http://localhost:3000/v1/users/{userId}
```
Atualiza o usuário que possui o ID fornecido no parametro da URL
```
PUT: http://localhost:3000/v1/users/{userId}
exemplo: Request Body: {
  "firstName": "TESTE",
  "lastName": "Teste",
  "email": "teste12@teste.com",
  "password": "12345678",
  "zipcode": "01311000"
}
