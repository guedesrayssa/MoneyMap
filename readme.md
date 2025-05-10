
<h1 align="center">
<img src="assets/docs/moneyMap_logo.png" width=200>
<p> MoneyMap - Controle Financeiro Pessoal </p>
</h1>

## Descrição do Projeto

**MoneyMap** é uma aplicação de controle financeiro pessoal que permite aos usuários registrar suas receitas e despesas, definir metas de gastos, visualizar seu saldo atual, acompanhar seu desempenho financeiro e receber alertas sobre possíveis excessos. O sistema também oferece funcionalidades bônus, como análise inteligente de gastos e projeção de economia.

## Funcionalidades

### Funcionalidades principais (MVP)
- **Cadastro e Login de Usuário**: Autenticação simples via e-mail e senha. Dados protegidos por autenticação.
- **Registro de Movimentações**: Registro de receitas e despesas com título, valor, categoria, data e tipo (entrada/saída). Visualização das transações com filtros por período e tipo.
- **Categorias Personalizáveis**: O usuário pode criar categorias personalizadas como Alimentação, Transporte, Lazer, etc. CRUD de categorias para o usuário.
- **Dashboard Financeiro**: Exibição do saldo atual e totais de receitas vs. despesas. Gráficos de pizza e linha para visualização do desempenho financeiro.
- **Planejamento Mensal**: Definição de limites de gastos por categoria e alertas quando o limite for ultrapassado.
- **Projeção de Economia**: Simulação de quanto pode sobrar no mês, com barra de progresso para metas de economia.

## Tecnologias Utilizadas

- **Banco de Dados**: PostgreSQL
- **Backend**: Node.js
- **Frontend**: HTML5, Css3, Javascript

---
# Como Usar

## Instalação

1. **Clonar o repositório:**

```bash
   git clone https://github.com/guedesrayssa/MoneyMap.git
   cd money-map
```

2. **Instalar as dependências:**

```bash
npm install
```



## Configuração do Banco de Dados

1. **Criar banco de dados:**

   Crie um banco de dados PostgreSQL com o nome especificado no seu arquivo `.env`.

2. **Executar o script SQL de inicialização:**

```bash
npm run init-db
```

Isso criará todas as tabelas do projeto no seu banco de dados PostgreSQL com UUID como chave primária.


# Scripts Disponíveis

- `npm start`: Inicia o servidor Node.js.
- `npm run dev`: Inicia o servidor com reinicialização automática após alterações no código.
- `npm run init-db`: Inicia as tabelas necessárias para o banco de dados.

## Estrutura de Diretórios

- **`assets/`**: Arquivos de imagem utilizados principalmente na documentação.
- **`config/`**: Configurações do banco de dados e outras configurações do projeto.
- **`controllers/`**: Controladores da aplicação (lógica de negócio).
- **`models/`**: Modelos da aplicação (definições de dados e interações com o banco de dados).
- **`routes/`**: Rotas da aplicação.
- **`scripts/`**: Scripts públicos a serem rodados para o setup do projeto.
- **`seeders/`**: Arquivos de população do banco de dados para teste.
- **`services/`**: Conexão entre os modelos do banco de dados e os controladores da aplicação.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT.