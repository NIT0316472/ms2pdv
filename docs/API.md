# API

Base: `/api`

## Autenticação
- `POST /api/auth/login`
- `GET /api/auth/me`

## Usuários
- `GET /api/users/me`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`

## Clientes
- `GET /api/clients`
- `GET /api/clients/:id`
- `POST /api/clients`
- `GET /api/clients/:id/history`

## Produtos
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`

## Vendas / PDV
- `POST /api/sales`
- `GET /api/sales/:id`
- `GET /api/sales`
- `POST /api/sales/:id/cancel`

Todas as rotas, exceto `POST /api/auth/login`, exigem Bearer token.
