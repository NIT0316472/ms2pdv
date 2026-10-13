# API

Base: `/api`

## Auth
- `POST /api/auth/login`
- `GET /api/auth/me`

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

## Usuários
- `GET /api/users/me`

Todas as rotas, exceto login, exigem Bearer token.
