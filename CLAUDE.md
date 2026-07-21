# VELU — contexto do projeto

Este arquivo orienta o Claude Code. Leia antes de mexer em qualquer coisa.

## Objetivo do projeto
VELU é um SaaS de inteligência comercial (CRM + IA) vendido para várias
empresas. Cada empresa cliente é uma linha na tabela `companies`; o mesmo
sistema atende todas, e o contexto de cada uma é injetado em tempo de
execução. A IA do produto se chama "Velu".

## Estrutura dos arquivos
Repositório enxuto, sem build. Estado atual (atualizar esta lista quando
algo for adicionado ou removido):

- `index.html` (raiz, ~3900 linhas): frontend inteiro, HTML + CSS + JS puro,
  sem framework. Usa o cliente supabase-js via CDN. É um arquivo grande,
  nunca ler inteiro sem necessidade (ver regras abaixo).
- `CLAUDE.md` (raiz): este arquivo.
- `supabase/functions/<slug>/index.ts` (ainda não versionado neste repo,
  mas faz parte da arquitetura real do produto): Edge Functions em
  Deno/TypeScript. Quando existirem aqui, cada pasta é uma function
  independente.

## Arquitetura
- Frontend: `index.html` único, publicado subindo o arquivo no host e
  limpando cache. Sem etapa de build.
- Backend: Supabase (projeto hjtdkfrlogktvmkeauwf, região sa-east-1).
  Postgres com RLS, multi-tenant (o usuário só enxerga a própria empresa).
  Edge Functions em Deno/TypeScript em `supabase/functions/<slug>/index.ts`,
  deploy com `supabase functions deploy <slug>`.

### Edge functions principais
- chat: o cérebro da IA. Monta o system prompt por modo (empresa, livre,
  code), injeta contexto da empresa, memória, skills (seleção automática pela
  mensagem) e arquivos, e faz streaming da resposta da Anthropic com busca web.
- find-leads: geração de leads. Interpreta nicho ou intenção ampla, pesquisa
  na web (streaming, orçamento de ~120s), valida e grava em `leads`, com
  gancho de abordagem por lead.
- profile-company: coleta o perfil público da empresa e preenche companies.profile.
- learn: memória contínua (ai_memories).
- Outras: analyze, image, video-assist, lead-worker (cron), lead-pipeline-health.

### Tabelas centrais
companies (contexto por cliente: name, sector, positioning, icp, tone, rules,
description, profile), profiles (usuário -> company_id), competitors +
competitor_notes (dossiês), leads (pipeline, campos stage e campaign_hook),
lead_runs, skills, conversations, messages, ai_memories, files, lead_evidence.

## Convenções do produto (importantes)
- Tudo em português do Brasil.
- Nunca use travessão (—). Use vírgula, ponto ou parênteses.
- Interface enxuta e profissional, nada de excesso de emoji.
- No chat, o efeito de digitação só acompanha o rodapé se o usuário já estiver
  no fim (não puxe a tela pra cima).
- Ao mexer numa edge function, mude só o necessário e mantenha a lógica.
  Cada deploy é versionado no Supabase, dá pra reverter.
- A IA usa o modelo claude-sonnet-4-6 e a busca web nas funções.

## Como publicar
- Frontend: subir o index.html no host e limpar cache.
- Backend: supabase functions deploy <slug>.

## Onboarding de cliente novo
Criar, na ordem: linha em companies (slug + name + contexto), usuário de
acesso (auth) e linha em profiles ligando o usuário à empresa. Não há gatilho
automático.

---

## Regras de trabalho para o Claude Code neste projeto

O objetivo aqui é gastar o mínimo de tokens possível e nunca ler arquivos
sem necessidade real.

### Economia de tokens
- Antes de qualquer alteração, olhe primeiro a estrutura (`ls`, tamanhos de
  arquivo) em vez de abrir arquivos de cara.
- Nunca leia um arquivo inteiro só para "ter contexto geral". Use busca
  (grep/Grep) para achar a seção, função ou trecho relevante, e leia só essa
  faixa de linhas.
- `index.html` é grande (milhares de linhas, CSS + JS + HTML no mesmo
  arquivo). Para editar algo nele, primeiro localize por palavra-chave
  (nome de função, classe CSS, texto visível) e leia só o trecho ao redor do
  match, não o arquivo todo.
- Se precisar entender o fluxo de uma função específica, leia só essa
  função, não o arquivo inteiro em volta dela.
- Evite reler arquivos que já foram lidos nesta mesma conversa, a menos que
  algo tenha mudado desde então.

### Edição segura
- Prefira mudanças pequenas, cirúrgicas e fáceis de revisar (diffs curtos) a
  reescritas grandes.
- Não apague trechos de código, dados ou configuração sem avisar antes e
  explicar o motivo.
- Não invente bibliotecas, dependências, endpoints ou APIs que não existam
  no projeto. Se for necessário algo novo, explique o porquê antes de usar.
- Ao editar uma edge function, mude apenas o necessário para a tarefa pedida
  e preserve a lógica existente ao redor.
- Nunca use `—` (travessão) em textos voltados ao usuário final do produto.

### Antes de modificar qualquer arquivo
Sempre, antes de editar:
1. Diga quais arquivos pretende alterar.
2. Diga por quê (qual problema ou pedido isso resolve).
3. Só então faça a edição.

Não é preciso pedir aprovação passo a passo para cada linha, mas o usuário
precisa saber o alvo e o motivo antes da mudança acontecer.

### Como testar ou revisar alterações
- Não há suíte de testes automatizada neste projeto. A verificação é manual.
- Para o frontend (`index.html`): como não há build, a forma mais direta de
  checar é abrir o arquivo (ou servir localmente) e conferir visualmente a
  tela afetada, não o site inteiro.
- Para edge functions: `supabase functions deploy <slug>` já versiona o
  deploy (dá pra reverter), então prefira mudanças pequenas e testáveis
  isoladamente por função.
- Depois de qualquer alteração, resuma exatamente o que mudou (quais
  arquivos, quais trechos, e por quê), para facilitar a revisão do usuário.

### Resumo final obrigatório
Ao terminar uma tarefa, sempre responder com um resumo direto do que foi
alterado, sem inflar com detalhes irrelevantes nem repetir o que já foi dito
durante a execução.
