# CRUD — Sistema de Gerenciamento Personal Trainer

Sistema de gerenciamento para personal trainers, com cadastro de alunos, sessões, avaliações, pagamentos e pacotes. Desenvolvido com Node.js, Express e Prisma ORM conectado ao PostgreSQL.

---

## Integrantes

- Camila Nóbrega Carvalho
- Helena Maria Duarte Souto
- Matheus Costa Morais

---

## Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript
- **Express** — framework para criação da API REST
- **Prisma ORM** — mapeamento objeto-relacional e migrações
- **PostgreSQL** — banco de dados relacional
- **DBeaver** — interface visual para gerenciamento do banco
- **Postman** — testes das rotas da API
- **Docker** — containerização do ambiente
- **JavaScript** — linguagem de programação

---

## Estrutura do projeto

```
src/
├── controllers/       # Recebe requisições e chama os services
│   ├── alunoController.js
│   ├── pacoteController.js
│   ├── sessaoController.js
│   ├── pagamentoController.js
│   ├── avaliacaoController.js
│   └── historicoSessaoController.js
├── services/          # Regras de negócio e acesso ao banco
│   ├── alunoService.js
│   ├── pacoteServices.js
│   ├── sessaoServices.js
│   ├── pagamentoService.js
│   ├── avaliacaoService.js
│   └── historicoSessaoService.js
├── routes/            # Definição das rotas da API
│   ├── alunoRoutes.js
│   ├── pacoteRoutes.js
│   ├── sessaoRoutes.js
│   ├── pagamentoRoutes.js
│   ├── avaliacaoRoutes.js
│   └── historicoSessaoRoutes.js
└── server.js          # Ponto de entrada da aplicação
prisma/
└── schema.prisma      # Modelos e configuração do banco
```

---

## Pré-requisitos

- Node.js v18+
- Prisma 5
- PostgreSQL 16 rodando localmente ou via Docker
- npm

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/helenasouto/CRUD---Sistema-de-Gerenciamento-Personal
cd CRUD---Sistema-de-Gerenciamento-Personal
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

### 4. Rode as migrações

```bash
npx prisma migrate dev
```

### 5. Inicie o servidor

```bash
node src/server.js
```

O servidor será iniciado na porta **3000**.

---

## Rotas disponíveis

### Pacotes
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /pacotes/cadastro | Cadastrar pacote |
| GET | /pacotes/todos | Listar todos os pacotes |
| GET | /pacotes/:id | Buscar pacote por ID |
| PUT | /pacotes/atualizar/:id | Atualizar pacote |
| DELETE | /pacotes/deletar/:id | Deletar pacote por ID |
| DELETE | /pacotes/deletar/nome | Deletar pacote por nome |

### Alunos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /alunos/cadastro | Cadastrar aluno |
| GET | /alunos/todos | Listar todos os alunos |
| GET | /alunos/buscar?nome= | Buscar aluno por nome |
| GET | /alunos/relatorio | Relatório de alunos |
| GET | /alunos/:id | Buscar aluno por ID |
| PUT | /alunos/atualizar/:id | Atualizar aluno |
| DELETE | /alunos/deletar/:id | Deletar aluno por ID |
| DELETE | /alunos/deletar/nome | Deletar aluno por nome |

### Sessões
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /sessoes/cadastro | Cadastrar sessão |
| GET | /sessoes/todos | Listar todas as sessões |
| GET | /sessoes/aluno/buscar?nome= | Listar sessões por nome do aluno |
| GET | /sessoes/aluno/:alunoId | Listar sessões por ID do aluno |
| PATCH | /sessoes/status/:id | Atualizar status da sessão |
| PATCH | /sessoes/reagendar/:id | Reagendar sessão |
| DELETE | /sessoes/deletar/:id | Deletar sessão |

### Pagamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /pagamentos/cadastro | Cadastrar pagamento |
| GET | /pagamentos/todos | Listar todos os pagamentos |
| GET | /pagamentos/aluno/buscar?nome= | Listar pagamentos por nome do aluno |
| GET | /pagamentos/aluno/:alunoId | Listar pagamentos por ID do aluno |
| PATCH | /pagamentos/status/:id | Atualizar status do pagamento |
| DELETE | /pagamentos/deletar/:id | Deletar pagamento |

### Avaliações
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /avaliacoes/cadastro | Cadastrar avaliação |
| GET | /avaliacoes/todos | Listar todas as avaliações |
| GET | /avaliacoes/aluno/buscar?nome= | Listar avaliações por nome do aluno |
| DELETE | /avaliacoes/deletar/:id | Deletar avaliação |

### Histórico de Sessões
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /historico/todos | Listar todo o histórico |
| GET | /historico/aluno/buscar?nome= | Listar histórico por nome do aluno |
| GET | /historico/sessao/:sessaoId | Listar histórico por sessão |

---

## Regras de negócio

- Aluno só pode ser cadastrado com um pacote existente
- Email de aluno não pode ser duplicado
- Aluno com status `INATIVO` ou `SUSPENSO` não pode agendar sessões
- Não é permitido agendar sessão em horário já ocupado
- Número de sessões por semana é limitado pela frequência do pacote
- Número de reposições por mês é limitado pelo pacote
- Pacote com alunos vinculados não pode ser deletado
- Aluno com sessões agendadas não pode ser deletado

---

## Banco de Dados

### Diagrama de Entidade-Relacionamento

O banco de dados é composto por 6 tabelas principais:

| Tabela | Descrição |
|--------|-----------|
| `pacotes` | Planos disponíveis para os alunos |
| `alunos` | Alunos cadastrados no sistema |
| `sessoes` | Sessões de treino agendadas |
| `historico_sessoes` | Histórico de reagendamentos |
| `pagamentos` | Pagamentos dos alunos |
| `avaliacoes` | Avaliações físicas periódicas |

### Relacionamentos

- Um **Pacote** possui muitos **Alunos**
- Um **Aluno** agenda muitas **Sessões**
- Um **Aluno** realiza muitos **Pagamentos**
- Um **Aluno** faz muitas **Avaliações**
- Uma **Sessão** gera muitos registros em **Histórico de Sessões**

### Enums utilizados

| Enum | Valores |
|------|---------|
| `Sexo` | `MASCULINO`, `FEMININO`, `OUTRO` |
| `NivelExperiencia` | `INICIANTE`, `INTERMEDIARIO`, `AVANCADO` |
| `StatusAluno` | `ATIVO`, `INATIVO`, `SUSPENSO` |
| `DiaSemana` | `SEGUNDA`, `TERCA`, `QUARTA`, `QUINTA`, `SEXTA`, `SABADO`, `DOMINGO` |
| `StatusSessao` | `AGENDADA`, `REALIZADA`, `CANCELADA`, `FALTA`, `REAGENDADA` |
| `TipoSessao` | `NORMAL`, `REPOSICAO` |
| `FormaPagamento` | `PIX`, `CARTAO_CREDITO`, `CARTAO_DEBITO`, `DINHEIRO`, `BOLETO` |
| `StatusPagamento` | `PENDENTE`, `CONFIRMADO`, `ATRASADO`, `CANCELADO` |

### Índices

- `alunos`: índices em `nome`, `status`, `pacoteId`
- `sessoes`: índices em `alunoId`, `data`, `status`, `tipo`
- `pagamentos`: índices em `alunoId`, `status`
- `avaliacoes`: índices em `alunoId`, `dataAvaliacao`
- `pacotes`: índice em `ativo`

---

## Repositório

[https://github.com/helenasouto/CRUD---Sistema-de-Gerenciamento-Personal]
