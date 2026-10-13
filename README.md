# MS² Vestuário — Sistema PDV

Projeto de Conclusão de Curso baseado na apresentação fornecida: modernização da operação varejista, catálogo digital, base de clientes e frente de caixa (PDV), com autenticação, níveis de acesso, regras de desconto e integração Frontend ↔ API ↔ Banco.

## Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Banco: MySQL 8.4
- Comunicação: Axios
- Autenticação: JWT + bcrypt
- Testes: Vitest + Supertest
- Ferramentas: GitHub / VS Code

## Assumptions necessários para completar o projeto
A apresentação não define alguns detalhes técnicos. Para não inventá-los como se fossem requisitos da banca, este projeto os deixa documentados:
- MySQL foi adotado como SGBD relacional para o projeto.
- Limites iniciais de desconto são configuráveis por ambiente: caixa 10% e gerente 30%.
- O modelo inclui `sale_items`, necessário para uma venda conter vários produtos, embora a apresentação liste apenas Produtos, Clientes, Vendas e Usuários como tabelas mínimas.
- O estoque é mantido como quantidade do produto e reduzido no checkout.

## Requisitos
- Node.js 20+
- npm 10+
- MySQL 8+ ou Docker

## Execução rápida

### 1. Banco
```bash
docker compose up -d mysql
```

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run db:init
npm run seed
npm run dev
```

Linux/macOS: use `cp .env.example .env`.

API: http://localhost:3000

### 3. Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Usuários de demonstração
- Caixa: `caixa@ms2.local` / `Caixa@123`
- Gerente: `gerente@ms2.local` / `Gerente@123`

Troque essas senhas antes de qualquer uso real.

## Fluxo da Live Demo
1. Login como caixa.
2. Cadastrar cliente.
3. Cadastrar produto.
4. Abrir PDV e adicionar produtos.
5. Aplicar desconto dentro do limite do caixa.
6. Finalizar checkout.
7. Entrar como gerente e demonstrar uma ação administrativa.

## Sprints
1. Engenharia de requisitos e dados — `docs/REQUISITOS.md`, `database/schema.sql`, `docs/DER.md`.
2. Setup e camada de dados — Models, `.env`, MySQL.
3. Regras de negócio e rotas — Controllers, Services e API.
4. Interface — React/Vite, Login, PDV, Produtos e Clientes.
5. Integração e homologação — Axios, fluxo E2E e testes.
6. Defesa — roteiro em `docs/DEFESA.md`.

## DER

O Diagrama Entidade-Relacionamento exigido na Sprint 1 está em `docs/DER.png`, com versão vetorial em `docs/DER.svg` e documentação em `docs/DER.md`.
