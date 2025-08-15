# Rocketseat Node.js API

API REST construída em Node.js com TypeScript, Fastify e Drizzle ORM, utilizando PostgreSQL como banco de dados. O objetivo é servir como base de estudos/curso, com foco em boas práticas de tipagem, validação e documentação.


## Tecnologias

<p align="left">
  <a href="https://nodejs.org" target="_blank"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="https://fastify.dev" target="_blank"><img alt="Fastify" src="https://img.shields.io/badge/Fastify-000000?logo=fastify&logoColor=white" /></a>
  <a href="https://zod.dev" target="_blank"><img alt="Zod" src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white" /></a>
  <a href="https://orm.drizzle.team/" target="_blank"><img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle%20ORM-0C0C0C?logo=drizzle&logoColor=00E18C" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" /></a>
  <a href="https://jwt.io/" target="_blank"><img alt="JWT" src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" /></a>
  <a href="https://github.com/ranisalt/node-argon2" target="_blank"><img alt="Argon2" src="https://img.shields.io/badge/Argon2-0B0B0B?logo=adguard&logoColor=white" /></a>
  <a href="https://vitest.dev/" target="_blank"><img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white" /></a>
  <a href="https://github.com/ladjs/supertest" target="_blank"><img alt="Supertest" src="https://img.shields.io/badge/Supertest-2C3E50?logo=javascript&logoColor=white" /></a>
  <a href="https://www.docker.com/" target="_blank"><img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" /></a>
  <a href="https://fly.io/" target="_blank"><img alt="Fly.io" src="https://img.shields.io/badge/Fly.io-7B68EE?logo=flydotio&logoColor=white" /></a>
  <a href="https://scalar.com/" target="_blank"><img alt="Scalar" src="https://img.shields.io/badge/Scalar-111827?logo=swagger&logoColor=white" /></a>
</p>


## Sumário

- [Introdução](#introdução)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Como executar](#como-executar)
- [Scripts disponíveis](#scripts-disponíveis)
 - [Autenticação](#autenticação)
- [Testes e cobertura](#testes-e-cobertura)
- [Banco de dados e migrações](#banco-de-dados-e-migrações)
- [Documentação da API](#documentação-da-api)
 - [Deploy (Fly.io)](#deploy-flyio)
- [Estrutura de pastas](#estrutura-de-pastas)
 - [Diagrama](#diagrama)

## Introdução

Projeto de backend em Node.js com foco em:

- __Tipagem estática__: `TypeScript`.
- __Framework HTTP performático__: `Fastify`.
- __Validação/serialização de esquemas__: `zod` com `fastify-type-provider-zod`.
- __Camada de dados__: `Drizzle ORM` com `PostgreSQL`.
- __Documentação__: OpenAPI via `@fastify/swagger` e UI via `@scalar/fastify-api-reference` (em ambiente de desenvolvimento).

## Diagrama

```mermaid
flowchart TD
  A[Cliente] --> B[Fastify Server<br/>server.ts]
  B --> C[Rotas<br/>src/routes/*]
  C --> D[Validação e Tipagem<br/>zod + fastify-type-provider-zod]
  C --> E[Handlers de Rotas]
  E --> F[Drizzle ORM]
  F --> G[(PostgreSQL<br/>docker-compose.yml)]
  F -. Config .-> H[DATABASE_URL<br/>.env + drizzle.config.ts]
  B -. Docs (dev) .-> I[OpenAPI + UI<br/>@fastify/swagger + @scalar/fastify-api-reference<br/>/docs]
```

## Pré-requisitos

- Docker e Docker Compose instalados (para subir o PostgreSQL facilmente), ou um PostgreSQL acessível.
- Node.js e npm instalados.

## Configuração do ambiente

1) Crie um arquivo `.env` na raiz do projeto. O script de desenvolvimento carrega variáveis com `--env-file .env`.

Exemplo de `.env`:

```env
# URL do banco usada pelo Drizzle e pela aplicação
DATABASE_URL=postgres://postgres:postgres@localhost:5432/desafio

# Habilita Swagger e a UI de documentação
NODE_ENV=development

# Segredo para assinar/verificar JWTs (obrigatório)
JWT_SECRET=uma_chave_segura_aqui
```

2) (Opcional) Ajuste o `docker-compose.yml` caso queira trocar usuário/senha/nome do DB.

## Como executar

1) Suba o banco via Docker Compose:

```bash
docker compose up -d db
```

2) Gere e/ou rode as migrações (veja seção de migrações abaixo).

3) Inicie o servidor em desenvolvimento:

```bash
npm run dev
```

O servidor inicia por padrão na porta `3000`. Veja `src/server.ts`.

## Scripts disponíveis

Conforme `package.json`:

- __dev__: inicia o servidor com `node --env-file .env --watch --experimental-strip-types server.ts`.
- __db:generate__: gera migrações com o `drizzle-kit` a partir do schema em `src/database/schema.ts`.
- __db:migrate__: aplica as migrações para o banco configurado em `DATABASE_URL`.
- __db:studio__: abre o Drizzle Studio para inspeção do schema/dados.
- __db:seed__: popula dados de desenvolvimento a partir de `src/database/seed.ts` usando `.env`.
- __test__: executa os testes com Vitest e coleta cobertura (`vitest run --coverage`) em ambiente `.env.test`.

Execute com:

```bash
npm run <script>
```

## Autenticação

- __Login__: `POST /login` com `email` e `password`.
- __Hash de senha__: feito com `argon2`.
- __Token__: JWT assinado com `JWT_SECRET` e expiração de 1 dia.
- __Envio do token__: header `Authorization: Bearer <token>`.

## Testes e cobertura

- __Runner__: `vitest` com provider de cobertura `@vitest/coverage-v8`.
- __Banco de testes__: o script `pretest` executa `drizzle-kit migrate` usando `.env.test` antes dos testes.
- __Cobertura__: ao rodar `npm test`, um relatório é gerado (texto no terminal e HTML em `coverage/`).

Exemplo de `.env.test`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/desafio_test
# Segredo para JWT nos testes (pode ser diferente do de dev)
JWT_SECRET=uma_chave_segura_para_testes
```

Comandos úteis:

```bash
npm test                 # roda testes + coverage
dotenv -e .env.test vitest --ui   # modo interativo (opcional)
```

## Banco de dados e migrações

- __Configuração Drizzle__: `drizzle.config.ts` exige `DATABASE_URL` definido no ambiente.
- __Schemas__: definidos em `src/database/schema.ts` (ex.: tabelas `users` e `courses`).
- __Saída de migrações__: diretório `drizzle/`.

Fluxo sugerido:

```bash
# 1) Gerar migrações a partir do schema
npm run db:generate

# 2) Aplicar migrações
npm run db:migrate

# 3) (Opcional) Abrir Drizzle Studio
npm run db:studio
```

O serviço do Postgres via Docker Compose (ver `docker-compose.yml`) usa a imagem `postgres:17`, expõe a porta `5432` e persiste dados no diretório `data/`.

## Documentação da API

- A documentação OpenAPI é registrada em desenvolvimento quando `NODE_ENV=development` (ver `server.ts`).
- A UI de referência está disponível em: `http://localhost:3000/docs`.

## Deploy (Fly.io)

- Arquivo de configuração: `fly.toml`.
- Porta interna: `3000` (veja `[http_service]`).
- Comando de release aplica migrações e seed: veja `[deploy.release_command]`.
- Variáveis necessárias (defina como secrets no Fly.io):
  - `DATABASE_URL`
  - `JWT_SECRET`

Exemplos úteis:

```bash
# Publicar a aplicação (requer flyctl configurado)
fly deploy

# Definir secrets
fly secrets set DATABASE_URL="postgres://..." JWT_SECRET="sua_chave_segura"
```

## Estrutura de pastas

```
.
├── drizzle/                # Migrações geradas e metadados
├── src/
│   ├── database/
│   │   └── schema.ts       # Definição das tabelas (Drizzle)
│   └── routes/             # Rotas registradas pelo servidor
│   ├── app.ts              # Instância do Fastify + plugins/rotas
│   └── server.ts           # Entrada da aplicação (listen)
├── docker-compose.yml      # Serviço PostgreSQL (desenvolvimento)
├── drizzle.config.ts       # Configuração do Drizzle Kit
├── package.json            # Scripts e dependências
└── req.http                # Requisições de teste (opcional)
```

---

Qualquer dúvida ou sugestão de melhoria, fique à vontade para abrir uma issue ou enviar um PR.