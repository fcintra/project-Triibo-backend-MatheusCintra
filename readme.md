
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

2. Configure o arquivo .env

Crie um arquivo .env na raiz do seu projeto e configure as informações do banco de dados conforme o exemplo abaixo:

```env
DATABASE_URL="postgresql://userApi:randompassword@localhost:5432/apiUser?schema=public"
PORT=3000
JWT_SECRET="superSecret"
```
Nota: Coloquei o .env assim pois é para um banco de dados local apenas (isso não pode ocorrer com banco de dados em produção).
Além disso, não se pode expor o jwt_secret e nem a porta desta forma.

3. Execute o Docker Compose

Abra o terminal na raiz do seu projeto e execute o seguinte comando para iniciar o contêiner Docker:

```bash
docker compose up -d
```
Nota: Certifique-se de que a porta 5432 está livre. Caso esteja em uso, pare a aplicação que a utiliza, libere a porta e execute novamente o Docker Compose.

4. Gere o Client do Prisma

```bash
npx prisma generate
```

5. Execute as Migrações

Com o contêiner em execução, execute as migrações para criar o banco de dados:

```bash
npx prisma migrate dev
```

6. Inicie o Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento com o seguinte comando:

```bash
yarn dev
```

7. Executando os testes

```bash
yarn test
```

Agora sua aplicação deve estar acessível em http://localhost:3000.


