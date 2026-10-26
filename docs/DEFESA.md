# Sprint 6 — Defesa Técnica

## Apresentação Oficial (15 Minutos)

Para a defesa técnica exigida pela banca da Unidade Curricular de Desenvolvimento de Sistemas, estão disponíveis dois formatos prontos para apresentação:

1. **Apresentação Interativa em Navegador:** [`docs/apresentacao.html`](./apresentacao.html)  
   - Apresentação completa com 10 slides estilizados no tema da Singularidade.
   - Navegação por teclas direcionais (`←` e `→` ou `Espaço`).
   - Cronômetro de 15 minutos integrado para controle do tempo da banca.
   - Modo Apresentador com notas e roteiro de fala ao pressionar a tecla `N`.
   - Modo Tela Cheia ao pressionar a tecla `F`.
   - Checklist interativo da Live Demo.

2. **Roteiro em Markdown & Script de Fala:** [`docs/APRESENTACAO_SLIDES.md`](./APRESENTACAO_SLIDES.md)  
   - Detalhamento textual de cada slide com texto para os slides, roteiro de fala minuto a minuto e guia de respostas para perguntas prováveis da banca.

---

## Estrutura da Apresentação

### Parte 1 — Pitch Técnico (7 minutos)
1. **Capa:** Singularidade, autores e unidade curricular.
2. **O Cenário e o Problema:** A era do papel, filas no checkout e inconsistência financeira.
3. **A Solução Proposta:** Catálogo de Produtos com gerador de código aleatório (formato 2 letras + 3 números, ex: `MS001`), Base de Clientes (CPF único) e Frente de Caixa (PDV).
4. **Arquitetura e Tecnologias:** React/Vite, Node.js/Express, TypeScript, MySQL 8.4, Docker, Zod, JWT.
5. **Modelagem de Dados:** DER em Terceira Forma Normal (relação Usuários, Clientes, Produtos, Vendas e Itens da Venda).
6. **Principais Desafios:** Concorrência de estoque, comunicação CORS/tipagem unificada e controle de alçadas de desconto.
7. **Soluções e Aprendizados:** Transações ACID (`withTransaction`), arquitetura em camadas, testes unitários automatizados (Vitest) e apoio estratégico de IA.
8. **Transição para a Live Demo:** Abertura da simulação prática.
9. **Próximos Passos (Versão 2.0):** Dashboards gerenciais, alertas preditivos de estoque e recibos digitais via WhatsApp.
10. **Encerramento:** Agradecimentos e abertura para a banca.

---

### Parte 2 — Roteiro da Live Demo (8 minutos)
1. **Login como Caixa:** `caixa@singularidade.local` / `Caixa@123` (ou botão de atalho na tela de login).
2. **Cadastrar Cliente:** Inserir nome e CPF (com validação de formato e unicidade).
3. **Cadastrar Produto:** Utilizar o botão `🎲 Gerar Código Aleatório` (gera no formato 2 letras e 3 números, ex: `MS001`), definindo preço e estoque.
4. **Abrir PDV:**
   - Buscar o produto pelo código ou nome.
   - Selecionar o cliente cadastrado.
   - Adicionar unidades ao carrinho.
5. **Aplicar Desconto:**
   - Testar tentativa com desconto superior a 10% (mostrando a regra de negócio e bloqueio de alçada).
   - Aplicar desconto autorizado (ex: 5% a 10%).
6. **Finalizar Venda:** Registrar o checkout e observar a baixa automática no estoque.
7. **Demonstrar Ação Gerencial (Cancelamento):**
   - Efetuar login como Gerente (`gerente@singularidade.local` / `Gerente@123`).
   - Acessar o Dashboard e visualizar o histórico de vendas.
   - Cancelar a venda com o botão exclusivo de Gerente, comprovando a RN08.

---

## Regra de Ouro
O sistema deve estar rodando localmente na máquina da dupla durante a banca.
