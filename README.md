# CryptoDash - Plataforma de Negociação de Criptomoedas

Uma plataforma de negociação de criptomoedas fictícia construída com Next.js, Prisma e PostgreSQL.

## Funcionalidades

- Autenticação de usuários
- Carteira de criptomoedas
- Compra e venda de criptomoedas
- Histórico de transações
- Favoritos
- Depósitos de USDT
- Integração com a API CoinGecko para dados em tempo real

## Requisitos

- Node.js 18+
- PostgreSQL
- NPM ou Yarn

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/crypto-dashboard.git
cd crypto-dashboard
```

2. Instale as dependências:

```bash
npm install
# ou
yarn
```

3. Instale o Prisma CLI globalmente (opcional):

```bash
npm install -g prisma
# ou
yarn global add prisma
```

4. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cryptodash?schema=public"
JWT_SECRET="sua-chave-secreta-para-jwt"
```

Substitua `usuario`, `senha` e outros valores conforme necessário.

5. Execute as migrações do Prisma:

```bash
npx prisma migrate dev
# ou
yarn prisma migrate dev
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

7. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

- `/app` - Código da aplicação Next.js
  - `/api` - Rotas da API
  - `/components` - Componentes React
  - `/hooks` - Hooks personalizados
  - `/lib` - Utilitários e configurações
  - `/prisma` - Esquema e migrações do Prisma

## Pacotes Necessários

Instale os seguintes pacotes para o projeto:

```bash
npm install @prisma/client bcryptjs jsonwebtoken zod axios
npm install -D prisma @types/bcryptjs @types/jsonwebtoken
```

## Comandos Úteis

- `npx prisma studio` - Interface visual para gerenciar o banco de dados
- `npx prisma migrate reset` - Resetar o banco de dados (cuidado: apaga todos os dados)
- `npx prisma generate` - Gerar cliente Prisma após alterações no esquema

## Licença

MIT
