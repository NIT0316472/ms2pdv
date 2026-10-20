# Homologação do fluxo MS² PDV

## Evidências executadas

### Build
- Backend: comando `npm run build` concluído com sucesso (`tsc` sem erros).
- Frontend: comando `npm run build` concluído com sucesso (`vite build` sem erros).

### Testes automatizados
- Arquivo: `backend/tests/api.test.ts`
- Resultado: `10/10 testes passaram`.
- Cobertura:
  - saúde da API
  - login e sessão (`/api/auth/login`, `/api/auth/me`)
  - cadastro/listagem/consulta de clientes
  - histórico de compras do cliente (`/api/clients/:id/history`)
  - cadastro/listagem/atualização de produtos
  - criação de venda e transação
  - cancelamento de venda por gerente
  - autorização por papel em usuários e vendas

## Confirmações de negócio

### Venda e transação
- A criação de vendas é executada em uma transação (`withTransaction`) no backend.
- A validação de cliente, produtos, quantidade, desconto e estoque acontece antes do commit.
- O estoque é reduzido apenas depois da inserção do item e do registro da venda.

### Cancelamento
- O endpoint `/api/sales/:id/cancel` só aceita `MANAGER`.
- Se a venda estiver em `COMPLETED`, o status muda para `CANCELLED` e registra quem cancelou e quando.
- Se a venda já estiver cancelada ou inexistente, a API retorna `404`/`409` conforme a regra atual.

### Histórico do cliente (RF05)
- O endpoint `/api/clients/:id/history` foi validado e devolve as vendas do cliente em ordem decrescente de criação.
- Esse comportamento fica coberto no teste de API e também na rota da documentação.

### Autorização por papel
- Backend: validado via middleware `auth` + `roles(...)` em rotas sensíveis.
- Frontend: a aplicação identifica o papel do usuário e exibe o status na interface; o restante da regra de autorização continua sendo reforçado pela API.

## Coleção para Insomnia/Thunder Client
- Arquivo: `docs/insomnia-ms2-pdv.json`
- Contém requests para autenticação, clientes, produtos, vendas e usuários.

## Observações finais
- O projeto já estava com a base de build estável; a correção principal foi garantir a suíte automatizada do fluxo e a homologação dos endpoints centrais.
- O ambiente de execução em Windows foi validado com o caminho direto do `npm.cmd` sem alterar a política do sistema.
