# Sprint 1 — Engenharia de Requisitos e Dados

## Problema
A MS² Vestuário trabalha com cadernos, blocos de papel, calculadoras e catálogos impressos, causando lentidão no caixa, inconsistência financeira e perda de histórico.

## Requisitos funcionais
- RF01 — Autenticar usuário por e-mail e senha.
- RF02 — Restringir operações conforme o papel do usuário.
- RF03 — Cadastrar cliente.
- RF04 — Impedir CPF duplicado.
- RF05 — Consultar clientes e histórico de vendas.
- RF06 — Cadastrar produto.
- RF07 — Consultar produto por código, nome/descrição e preço.
- RF08 — Consultar estoque do produto.
- RF09 — Criar venda no PDV.
- RF10 — Adicionar múltiplos itens à venda.
- RF11 — Calcular subtotal, desconto e total no backend.
- RF12 — Aplicar desconto conforme limite do papel.
- RF13 — Finalizar venda e persistir no banco.
- RF14 — Baixar estoque no checkout.
- RF15 — Gerente pode cancelar uma venda.
- RF16 — Expor endpoints HTTP para integração do frontend.

## Requisitos não funcionais
- RNF01 — Frontend React/Vite e TypeScript.
- RNF02 — Backend Node.js/Express e TypeScript.
- RNF03 — Banco relacional.
- RNF04 — Variáveis sensíveis via `.env`.
- RNF05 — Senhas armazenadas com hash.
- RNF06 — API protegida por autenticação JWT.
- RNF07 — Validação de entrada.
- RNF08 — Sistema deve poder rodar localmente na máquina da dupla para a banca.
- RNF09 — Código versionável em GitHub.

## Regras de negócio
- RN01 — CPF é único.
- RN02 — Caixa pode operar vendas.
- RN03 — Gerente possui permissões administrativas maiores.
- RN04 — Desconto acima do limite do papel é recusado.
- RN05 — Não é permitido vender quantidade maior que o estoque.
- RN06 — Venda precisa ter ao menos um item.
- RN07 — Total nunca pode ser negativo.
- RN08 — Apenas gerente pode cancelar venda já registrada.

> Limites de desconto são uma decisão de implementação, pois a apresentação não informa percentuais. Foram definidos em `.env` como 10% para caixa e 30% para gerente.
