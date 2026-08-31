---
title: Personal RAG (RAG System)
type: project
locale: pt-BR
probable_questions:
  - O que é o projeto Personal RAG?
  - Como funciona a API do Personal RAG de José Henrique?
  - Quais tecnologias são utilizadas no Personal RAG (Bun, ElysiaJS, Drizzle ORM, pgvector, Groq)?
  - Como funciona o sistema de RAG (Retrieval-Augmented Generation), embeddings e chunking neste projeto?
  - Quais são os endpoints disponíveis na API (/chat, /retrieve, /chunk/save, /embbed)?
  - Qual é o modelo de embedding utilizado na API?
  - Como é realizada a busca por similaridade vetorial no banco PostgreSQL?
---

# Personal RAG (RAG Engine)

## Visão Geral do Projeto

O **Personal RAG** é um motor de RAG (Retrieval-Augmented Generation) e API RESTful de alta performance desenvolvida por José Henrique para servir como backend inteligente para seu site/portfólio pessoal. A API permite responder a perguntas sobre o perfil profissional, experiências e projetos de José Henrique com extrema precisão, utilizando conhecimento extraído dinamicamente de documentos Markdown.

## Arquitetura & Tecnologias

A aplicação segue princípios de **Clean Architecture** e separação de responsabilidades (Controllers, Services, Repositories, Schema/Database).

### Tech Stack:
- **Runtime:** Bun (Execução ultrarrápida de TypeScript/JavaScript).
- **Framework Web:** ElysiaJS (Framework web moderno, leve e de alta performance para Bun).
- **ORM & Banco de Dados:** Drizzle ORM com PostgreSQL e extensão pgvector (`vector(384)`).
- **Processamento de Embeddings:** `@huggingface/transformers` executando localmente o modelo `Xenova/multilingual-e5-small` (384 dimensões).
- **Chunking & Divisão de Texto:** LangChain TextSplitters (`RecursiveCharacterTextSplitter` para Markdown, chunkSize: 800, chunkOverlap: 50) e `gray-matter` para parsing de frontmatter metadata.
- **Modelo de Linguagem (LLM):** Integração via Groq SDK utilizando o modelo `openai/gpt-oss-120b` (ou equivalentes).

## Como Funciona o Pipeline de RAG (Retrieval-Augmented Generation)

1. **Ingestão e Chunking (`/chunk/save`):**
   - A API lê os arquivos `.md` contidos no diretório `documents/` (`profile.md`, `projects.md`, `experience.md`, `personal-rag.md`).
   - Extrai o frontmatter (título, tipo, locale, perguntas prováveis).
   - Divide o conteúdo em chunks semanticamente ricos (tamanho de 800 caracteres com sobreposição de 50).
   - Enriquece cada chunk com o contexto do documento e perguntas frequentes relacionadas.
   - Gera os embeddings vetoriais com o modelo `multilingual-e5-small` usando o prefixo exigido `passage: `.
   - Limpa e substitui os dados na tabela `profile` no PostgreSQL.

2. **Busca por Similaridade Vetorial (`/retrieve`):**
   - Transforma a consulta do usuário em embedding utilizando o prefixo `query: `.
   - Realiza a busca no PostgreSQL usando a distância de cosseno via operador `<=>` da extensão `pgvector`.
   - Permite filtragem por idioma/locale (ex: `pt-BR`, `en`).

3. **Geração de Respostas IA (`/chat`):**
   - Executa o retrieval com base na pergunta do usuário.
   - Seleciona os chunks mais relevantes (limite de distância de similaridade < 0.35).
   - Injeta o conhecimento recuperado no prompt de sistema do LLM via Groq API.
   - Retorna uma resposta precisa e contextualizada sobre José Henrique.

## Endpoints da API

- `POST /chat`: Recebe `{ prompt: string, locale?: string }` e retorna a resposta gerada pelo LLM contextualizada com a base de conhecimento.
- `POST /retrieve`: Recebe `{ query: string, locale?: string }` e retorna os chunks mais semelhantes ordenados por relevância.
- `GET /chunk/save`: Executa o reprocessamento de todos os arquivos markdown da pasta `documents/`, gerando embeddings e atualizando o banco de dados.
- `POST /embbed`: Recebe `{ query: string }` e retorna o vetor numérico (384 dimensões) correspondente ao texto enviado.
