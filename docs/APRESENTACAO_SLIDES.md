# Apresentação Final — Sistema PDV Singularidade
## Pitch Técnico e Roteiro de Defesa (Sprint 6)

> **Tempo total de apresentação:** 15 minutos (7 minutos de Pitch Técnico + 8 minutos de Live Demo)  
> **Unidade Curricular:** Desenvolvimento de Sistemas  
> **Tema:** Modernização e Informatização da Frente de Caixa e Gestão da Singularidade

---

## Sumário dos Slides

| Slide | Título | Objetivo | Tempo Sugerido |
| :---: | :--- | :--- | :---: |
| **01** | Capa do Projeto | Abertura formal e identificação da equipe | 0:30 min |
| **02** | O Cenário e o Problema | Contextualização do gargalo manual e impactos | 1:00 min |
| **03** | A Solução Proposta | Os 3 pilares do sistema informatizado | 1:00 min |
| **04** | Arquitetura e Tecnologias | Stack full-stack TypeScript e ferramentas | 1:00 min |
| **05** | Modelagem de Dados (DER) | Entidades, integridade referencial e 3FN | 1:30 min |
| **06** | Principais Desafios | Relato transparente dos bloqueios técnicos | 1:00 min |
| **07** | Soluções e Aprendizados | Como os obstáculos foram superados | 1:00 min |
| **08** | Transição para a Live Demo | Roteiro guiado da demonstração prática | 0:30 min + Demo (7:00 min) |
| **09** | Próximos Passos (Versão 2.0) | Visão de evolução do produto (Roadmap) | 0:45 min |
| **10** | Encerramento e Agradecimentos | Conclusão e abertura para a banca avaliadora | 0:45 min |

---

## Detalhamento Slide por Slide (Conteúdo + Roteiro de Fala)

### Slide 1: Capa
- **Título do Projeto:** Sistema de Gestão e PDV — Singularidade
- **Subtítulo:** Desafio Prático Final da Unidade Curricular de Desenvolvimento de Sistemas
- **Autores:** [Nome do Aluno 1] e [Nome do Aluno 2]
- **Instituição / Curso:** Curso Técnico em Desenvolvimento de Sistemas

> **Roteiro de Fala do Slide 1 (Apresentador 1):**  
> *"Boa tarde, professor e membros da banca. Eu sou o [Nome 1] e junto com o [Nome 2] apresentamos o Sistema de Gestão e Ponto de Venda desenvolvido para a Singularidade. Este projeto foi estruturado em seis sprints iterativas, simulando o dia a dia de uma consultoria de engenharia de software contratada para transformar uma operação de varejo tradicional em um ecossistema digital moderno, seguro e ágil."*

---

### Slide 2: O Cenário e o Problema
- **O Cenário da Loja:**
  - Loja de roupas e acessórios em rápida expansão na região.
  - Reconhecida pela qualidade das peças e proximidade no atendimento.
- **O Gargalo Operacional (A Era do Papel):**
  - Controle de estoque realizado em cadernos e fichas físicas.
  - Vendas anotadas em blocos de papel sob pressão no balcão.
  - Fechamento diário de caixa demorando horas, com quebras e inconsistências financeiras frequentes.
- **Impactos Diretos no Negócio:**
  - **Filas e lentidão no checkout:** Vendedores procurando preços em catálogos impressos e somando itens na calculadora mecânica.
  - **Falta de controle de descontos:** Ausência de regras de alçada para descontos no balcão.
  - **Perda de fidelização:** A gerência não possuía histórico de compras por cliente nem dados para recompra.

> **Roteiro de Fala do Slide 2 (Apresentador 1):**  
> *"Ao analisar o cenário da Singularidade, identificamos que o sucesso da marca gerou um efeito colateral crítico: o colapso dos processos manuais. Durante os horários de pico, formavam-se longas filas porque os vendedores precisavam consultar cadernos de preço e calcular totais manualmente. Além da lentidão, ocorriam divergências de caixa no fim do dia e a loja perdia dados preciosos dos seus clientes por não ter como registrar o histórico de consumo de forma confiável."*

---

### Slide 3: A Solução Proposta
- **Visão Geral:** Aplicação Web completa, centralizada e responsiva, operada via navegador nos terminais da loja.
- **Os Três Pilares da Solução:**
  1. **Catálogo Digital de Produtos:**
     - Digitalização do acervo com preço, estoque, grade (tamanho, cor, gênero).
     - **Gerador Automático de Códigos (SKU):** Padrão padronizado de **2 letras e 3 números** (ex: `MS001`, `AB123`), eliminando erros de digitação e permitindo consultas ultrarrápidas no balcão.
  2. **Base de Clientes Confiável:**
     - Cadastro rápido com garantia de **unicidade por CPF** (RN01), evitando cadastros duplicados e permitindo rastreabilidade do histórico de compras.
  3. **Frente de Caixa (PDV Ágil & Seguro):**
     - Leitura por código ou busca rápida por texto.
     - Cálculo automático de subtotais, descontos e total.
     - **Controle estrito de alçadas de desconto:** Caixa (até 10%) e Gerente (até 30%).
     - **Baixa automática de estoque** com integridade transacional ACID.

> **Roteiro de Fala do Slide 3 (Apresentador 2):**  
> *"Para erradicar esses problemas, concebemos uma solução baseada em três pilares fundamentais. Primeiro, o Catálogo Digital com gerador inteligente de códigos no formato de duas letras e três números, permitindo busca instantânea. Segundo, a Base de Clientes com validação estrita de CPF único. E terceiro, a Frente de Caixa em tempo real, onde os cálculos são automáticos e há validação rigorosa de alçadas de desconto e estoque garantido no banco de dados."*

---

### Slide 4: Arquitetura e Tecnologias
- **Frontend (Interface do Usuário):**
  - **React 18 + Vite:** Renderização de alta performance, tempo de resposta instantâneo.
  - **TypeScript:** Segurança de tipos estáticos de ponta a ponta.
  - **CSS Moderno / Variáveis de Design:** Tema dark futurista, legível e otimizado para longas jornadas de trabalho no caixa.
  - **Axios:** Comunicação HTTP assíncrona com interceptores de autenticação JWT.
- **Backend (API RESTful):**
  - **Node.js + Express + TypeScript:** Arquitetura desacoplada em Controllers, Services, Models e Middlewares.
  - **Zod:** Validação e sanitização rigorosa de todos os dados de entrada.
  - **JSON Web Token (JWT) & Bcrypt:** Autenticação stateless com hash criptográfico salgado para senhas.
- **Banco de Dados & Infraestrutura:**
  - **MySQL 8.4 (InnoDB):** Suporte nativo a chaves estrangeiras, restrições `CHECK`, índices otimizados e transações ACID.
  - **Docker Compose:** Provisionamento reproduzível do banco em qualquer máquina.
  - **Ferramentas de Desenvolvimento:** VS Code, Git/GitHub, Thunder Client, Vitest e Insomnia.

> **Roteiro de Fala do Slide 4 (Apresentador 2):**  
> *"Na arquitetura, escolhemos TypeScript tanto no frontend quanto no backend para termos contratos de tipos compartilhados e previsíveis. O backend em Node.js com Express e Zod valida cada requisição antes que qualquer dado chegue ao banco. O banco MySQL com engine InnoDB nos dá o suporte transacional necessário para o checkout. Para segurança, utilizamos JWT e Bcrypt para armazenamento com hash."*

---

### Slide 5: Modelagem de Dados (DER)
- **Apresentação do Diagrama Entidade-Relacionamento:**
  - **`USERS` (Usuários):** `id`, `name`, `email` (UNIQUE), `password_hash`, `role` (`CASHIER` | `MANAGER`).
  - **`CLIENTS` (Clientes):** `id`, `name`, `cpf` (UNIQUE), `phone`, `email`.
  - **`PRODUCTS` (Produtos):** `id`, `code` (UNIQUE), `name`, `description`, `size`, `color`, `gender`, `price`, `stock_quantity`, `active`.
  - **`SALES` (Vendas):** `id`, `client_id` (FK), `user_id` (FK), `subtotal`, `discount_percent`, `discount_amount`, `total`, `status`, `cancelled_by` (FK).
  - **`SALE_ITEMS` (Itens da Venda):** `id`, `sale_id` (FK), `product_id` (FK), `quantity`, `unit_price`, `subtotal`.
- **Decisões Técnicas de Modelagem:**
  - **Tabela Associativa `SALE_ITEMS`:** Permite que uma venda contenha múltiplos produtos e preserve o preço histórico unitário praticado na data da venda, mesmo que o produto seja alterado futuramente.
  - **Controle Transacional:** O checkout executa em transação única (`withTransaction`), debitando o estoque e criando o cabeçalho e os itens de forma atômica. Se um item falhar por falta de estoque, ocorre rollback automático.

> **Roteiro de Fala do Slide 5 (Apresentador 1):**  
> *"Aqui apresentamos o Diagrama Entidade-Relacionamento do sistema. Destacamos a relação entre Vendas, Clientes e Produtos. Para atender ao requisito de múltiplos itens por venda em conformidade com a Terceira Forma Normal, criamos a tabela associativa sale_items. Além de normalizar o banco, essa tabela preserva o preço histórico unitário vendido. Se o produto tiver reajuste amanhã, o histórico fiscal da venda passada permanece intacto."*

---

### Slide 6: Principais Desafios Enfrentados
1. **Controle de Concorrência e Estoque no Checkout:**
   - Evitar venda de produto sem estoque suficiente caso dois caixas finalizem itens simultaneamente.
2. **Divergência de Tipagem e CORS entre Frontend e Backend:**
   - Comunicação assíncrona entre portas diferentes (`http://localhost:5173` e `http://localhost:3000`), exigindo configuração de cabeçalhos CORS e alinhamento de interfaces TypeScript (`Product`, `Sale`, `Client`).
3. **Validação de Alçadas de Desconto e Cancelamento Seguro:**
   - Garantir que o caixa não consiga forçar um desconto maior via payload manual e que cancelamentos exijam auditoria gerencial estrita.

> **Roteiro de Fala do Slide 6 (Apresentador 1):**  
> *"Durante as sprints, enfrentamos três desafios técnicos reais. O primeiro foi garantir a consistência transacional do estoque durante a finalização do carrinho. O segundo foi o ajuste fino de políticas de CORS e de tipos no TypeScript para eliminar qualquer 'any' solto no código. E o terceiro foi a implementação segura da regra de negócio das alçadas de desconto, impedindo que o frontend manipulasse porcentagens indevidas."*

---

### Slide 7: Soluções Criadas e Aprendizados
- **Como Superamos os Obstáculos:**
  - **Transações SQL com `FOR UPDATE`:** Leitura bloqueante e decremento atômico com verificação de estoque no MySQL, impedindo estoque negativo.
  - **Arquitetura em Camadas (Clean Code):** Separação de responsabilidades em `routes` (roteamento), `controllers` (validação HTTP via Zod), `services` (regras de negócio) e `models` (consultas SQL parametrizadas contra SQL Injection).
  - **Gerador de Código Aleatório (2 Letras + 3 Números):**
    - Algoritmo no padrão `[A-Z]{2}[0-9]{3}` (ex: `MS001`, `AB123`), com loop de verificação de colisão no banco de dados.
    - Disponibilizado tanto como helper e botão interativo no Frontend (`🎲 Gerar Código`) quanto fallback automático na API.
  - **Testes Unitários Automatizados (Vitest):** Cobertura de rotas, autenticação, alçadas de desconto e validação do formato do código gerado.
  - **Uso Estratégico de IA e Documentação:** Apoio na escrita de scripts de seed, validações Zod e documentação padronizada no formato Markdown.

> **Roteiro de Fala do Slide 7 (Apresentador 2):**  
> *"Superamos esses desafios adotando uma arquitetura em camadas clara. Implementamos transações com withTransaction no banco para atomicidade absoluta. Criamos o gerador de códigos de produtos no padrão de duas letras e três números com botão direto na interface e fallback no backend com proteção contra duplicidade. E consolidamos a confiabilidade com testes unitários automatizados via Vitest."*

---

### Slide 8: Demonstração Prática (Live Demo)
- **Slide de Transição:** Início da simulação ao vivo do fluxo operacional real da loja.
- **Roteiro dos 5 Passos da Live Demo (7 a 8 minutos):**
  1. **Login com Perfil de Caixa:** Autenticação no sistema e visualização do Dashboard.
  2. **Cadastro Rápido de Cliente:** Registro com nome, telefone e CPF com validação de formato e unicidade.
  3. **Cadastro de Produto com Gerador de Código:** Demonstração do botão `🎲 Gerar Código Aleatório` (formato 2 letras + 3 números, ex: `MS001`), definição de preço e estoque.
  4. **Abertura do PDV e Montagem do Carrinho:**
     - Busca rápida do produto pelo código gerado (`MS001`) ou nome.
     - Seleção do cliente recém-cadastrado.
     - Inclusão dos itens no carrinho com cálculo de subtotal dinâmico.
  5. **Aplicação de Desconto e Checkout:**
     - Teste de alçada: tentativa de aplicar desconto acima do limite do caixa (bloqueio educativo).
     - Aplicação de desconto permitido (ex: 5% a 10%).
     - Finalização da venda e baixa de estoque imediata.
  6. **Ação Administrativa (Bônus):** Login como Gerente e demonstração da auditoria de vendas com cancelamento de venda autorizada.

> **Roteiro de Fala do Slide 8 (Apresentador 1 e 2):**  
> *"Agora convidamos a banca para acompanhar a Live Demo do sistema operando localmente na nossa máquina. Vamos demonstrar o ciclo de vida completo de uma venda real, desde o login até a baixa de estoque e auditoria gerencial."*

---

### Slide 9: Próximos Passos (Versão 2.0)
- **Visão de Futuro para a Singularidade (Evolução em 2 meses):**
  1. **Dashboard com Gráficos Analíticos:** Ticket médio diário, faturamento por período, curva ABC de produtos mais vendidos.
  2. **Controle Inteligente de Estoque:** Alertas automáticos de reposição para itens atingindo estoque mínimo.
  3. **Comprovante Digital via WhatsApp e E-mail:** Envio do cupom fiscal não-fiscal direto para o smartphone do cliente cadastrado.
  4. **Integração com Leitor de Código de Barras Físico:** Leitura direta de etiquetas impressas através do leitor USB/Bluetooth no PDV.

> **Roteiro de Fala do Slide 9 (Apresentador 2):**  
> *"Para uma futura versão 2.0, planejamos expandir a plataforma com um dashboard analítico em tempo real para a diretoria, alertas preditivos de reposição de estoque, emissão de comprovantes via WhatsApp e suporte direto a leitores físicos de código de barras nas estações de trabalho."*

---

### Slide 10: Encerramento
- **Agradecimentos:**
  - Ao professor orientador e à equipe docente da instituição.
  - Aos colegas de turma pela troca de experiências durante as sprints.
- **Mensagem Final:**
  - *"A modernização da Singularidade demonstra que soluções de engenharia de software bem modeladas transformam a eficiência operacional do varejo."*
- **Espaço Aberto:**
  - **Perguntas e Considerações da Banca Avaliadora.**

> **Roteiro de Fala do Slide 10 (Apresentador 1):**  
> *"Agradecemos imensamente a atenção de todos os professores e avaliadores. Nosso repositório e ambiente estão à disposição, e agora abrimos com entusiasmo para as perguntas e considerações da banca."*

---

## Guia Rápido: Perguntas Prováveis da Banca e Como Responder

### Pergunta 1: *"Por que vocês escolheram criar a tabela `sale_items` se o documento inicial citava apenas 4 tabelas?"*
- **Resposta Técnica:**  
  *"A modelagem inicial sugeria as entidades conceituais (Usuários, Clientes, Vendas, Produtos). No entanto, pela Terceira Forma Normal (3FN), uma venda precisa suportar N produtos, cada um com sua respectiva quantidade e valor unitário histórico. Sem a tabela `sale_items`, teríamos atributos multivalorados ou repetição de linhas de venda, violando princípios fundamentais de bancos relacionais."*

### Pergunta 2: *"Como funciona o gerador de códigos de duas letras e 3 números e como ele previne duplicidades?"*
- **Resposta Técnica:**  
  *"O gerador utiliza um algoritmo que combina 2 caracteres alfabéticos maiúsculos (`A-Z`) e um número inteiro de 3 dígitos com preenchimento de zeros à esquerda (`000` a `999`), resultando em 676.000 combinações possíveis. Tanto no endpoint da API quanto no formulário do frontend, o sistema valida no banco se o código gerado já existe. Caso exista, um novo código é gerado automaticamente antes de retornar ou salvar, garantindo a constraint UNIQUE."*

### Pergunta 3: *"Como vocês garantiram que o operador de caixa não consiga burlar o limite de 10% de desconto?"*
- **Resposta Técnica:**  
  *"A validação não depende exclusivamente do frontend. Toda requisição é autenticada via token JWT assinado digitalmente, que transporta o papel (`role`) do usuário. No backend, a camada de serviço (`saleService.ts`) consulta as variáveis de ambiente com os limites autorizados e rejeita com HTTP 403 Forbidden caso o desconto solicitado seja superior ao teto do papel logado."*

### Pergunta 4: *"O que acontece se a conexão cair no meio da finalização de uma venda?"*
- **Resposta Técnica:**  
  *"Utilizamos transações atômicas no MySQL (`withTransaction`). O registro do cabeçalho da venda, a inserção dos itens em `sale_items` e a atualização do estoque são encapsulados em um bloco de transação. Se qualquer etapa falhar ou a conexão for interrompida, o banco executa um ROLLBACK automático, garantindo que nenhum item seja baixado sem a venda correspondente."*

