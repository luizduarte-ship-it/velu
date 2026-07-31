# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este projeto e escrito e operado em portugues do Brasil. Escreva respostas,
commits e textos de produto em pt-BR.

## Objetivo do projeto
VELU e um SaaS de inteligencia comercial (CRM + IA) vendido para varias
empresas. Cada empresa cliente e uma linha na tabela `companies`; o mesmo
sistema atende todas, e o contexto de cada uma e injetado em tempo de execucao.
A IA do produto se chama "Velu". Esta no ar em **https://velucrm.com**.

## Estrutura do repositorio
Repo enxuto, sem build no frontend. Atualizar esta lista quando algo mudar:
- `index.html` (raiz, ~4200 linhas): o produto inteiro, HTML + CSS + JS puro num
  unico arquivo, sem framework. Usa supabase-js via CDN. E grande: nunca ler
  inteiro; localizar por palavra-chave (nome de funcao, classe CSS, texto
  visivel) e ler so o trecho ao redor.
- `netlify.toml`: config de deploy. No build, copia `index.html` para `dist/` e
  publica `dist/` (assim CLAUDE.md e o resto do repo nao vao para o ar).
- `dist/`: gerado no build, ignorado no git.
- `CLAUDE.md`: este arquivo.
- As edge functions (Deno/TypeScript) nao ficam versionadas neste repo; vivem no
  Supabase (deploy via MCP ou `supabase functions deploy <slug>`).

## Comandos
- **Publicar o frontend:** `git push` no branch de trabalho. A Netlify observa o
  repo e faz build+deploy automatico em `velucrm.com` (~1-2 min). Nao existe
  passo de build manual nem upload de arquivo.
- **Preview local:** abrir `index.html` no navegador (ou servir a pasta). Sem build.
- **Deploy de edge function:** `supabase functions deploy <slug>` (projeto
  `hjtdkfrlogktvmkeauwf`), ou a ferramenta MCP `deploy_edge_function`.
- **Checar sintaxe do JS do index.html** (nao ha lint/test): extrair os blocos
  `<script>` inline e rodar `node --check` em cada um.
- **Verificar a UI** (nao ha suite de testes): renderizar `index.html` num
  Chromium headless via Playwright (`/opt/pw-browsers/...`) apontando para
  `file:///.../index.html`, com `window.supabase` mockado (a app chama o
  Supabase no boot). Serve para conferir telas, abrir menus e diálogos.

## Arquitetura
- **Frontend:** `index.html` unico. Estado global no objeto `S`. Navegacao troca
  `.view.on`. Render por funcoes `paint*` que reescrevem innerHTML. Sem router,
  sem componentes.
- **Backend:** Supabase (projeto `hjtdkfrlogktvmkeauwf`, regiao sa-east-1).
  Postgres com RLS, multi-tenant (o usuario so enxerga a propria empresa via
  `company_id`). Edge Functions em Deno/TypeScript.
- **Hospedagem:** Netlify (projeto `velu-crm-ia`), dominio `velucrm.com`
  (registrado no Namecheap), HTTPS automatico. Deploy continuo ligado ao GitHub.

### Edge functions
- **find-leads:** motor de prospeccao. **Nao usa Claude** (para nao gastar
  credito). Busca na base publica de CNPJ via **CNPJa** (`api.cnpja.com/office`,
  token no secret `CNPJA_TOKEN`). Filtros: `mainActivity.id.in` (CNAE),
  `address.state.in` (UF), `status.id.in=2` (ativa); pagina pelo cursor `token`
  (mutuamente exclusivo dos filtros); custo ~1 credito por 10 registros. Traduz
  o nicho em CNAE por um mapa interno (fallback `names.in` por nome). O frontend
  dirige um **loop de lotes** (leads aparecem ao vivo, com barra de progresso e
  botao de abortar); `recommend:true` retorna a contagem real do mercado para
  sugerir a meta (100 a 400). Grava lote a lote em `leads` e devolve os novos.
- **price-suggest:** sugere valor a cobrar e descontos por lead. **Usa Claude**
  (`claude-sonnet-4-6`, secret `ANTHROPIC_API_KEY`), sob demanda (um lead por
  clique, no menu de 3 pontos). Se o saldo Anthropic zerar, a API responde 400
  "credit balance too low" (a funcao devolve mensagem amigavel).
- **chat:** o cerebro da IA (modo empresa/livre/code, memoria, skills, arquivos,
  streaming da Anthropic com busca web). **learn:** memoria continua
  (ai_memories). **profile-company, analyze, image, video-assist.**
- **lead-worker (cron):** DESATIVADO. A busca automatica de leads foi removida
  (a UI de automacao saiu do frontend e o cron do pg_cron, jobid 1, esta com
  active=false) para nao gastar credito Claude ao ser ativada. O codigo continua
  no Supabase (modelo hibrido CNPJa + qualificacao Claude, com fallback, em
  `leads-shared.ts`), mas nada o dispara. A busca MANUAL de leads (find-leads,
  so CNPJa, sem Claude) segue ativa e e a unica forma de gerar leads.
- `cnpj-probe` e `ai-probe` sao sondas de teste desativadas (retornam 410/403);
  podem ser removidas pelo painel do Supabase.

### Tabelas centrais (public schema)
`companies` (contexto por cliente: name, sector, positioning, icp, tone, rules,
description, profile, daily_lead_limit), `profiles` (usuario -> company_id),
`competitors` + `competitor_notes` (dossies), `leads` (pipeline e prospeccao),
`lead_runs` (execucoes de busca; cursor de paginacao em `progress.next`),
`skills`, `conversations`, `messages`, `ai_memories`, `files`, `usage_counters`.
- `leads.in_pipeline` (bool): o Pipeline so mostra leads com `in_pipeline=true`.
  Leads gerados NAO entram no board sozinhos; a entrada e manual pelo menu de 3
  pontos. `leads.due_date` (date): prazo mostrado no card.

### Padroes de UI (importantes)
- **Nunca usar `confirm`/`prompt`/`alert` do navegador** (aparece "o site diz").
  Use `uiConfirm(msg, {okText, danger})` e `uiPrompt(label, value, {okText,
  placeholder})`, que retornam Promise e renderizam dialogo proprio.
- Menus de contexto (3 pontos) usam a classe `.pop` com `position:fixed` +
  `placePop(pop, rect)`, que ancora ao lado do gatilho e nao vaza da tela. Ha
  menus de 3 pontos nos cards de Leads e do Pipeline.
- `openModal`/`closeModal` para modais de conteudo (ex.: sugestao de preco).
- O favicon e a logo "V" embutida em base64 no `<head>`.

## Convencoes do produto
- Tudo em portugues do Brasil.
- **Nunca use travessao (—).** Use virgula, ponto ou parenteses. Vale para todo
  texto voltado ao usuario final (o "—" so pode existir em regex que o trata).
- Interface enxuta e profissional, nada de excesso de emoji.
- No chat, o efeito de digitacao so acompanha o rodape se o usuario ja estiver no
  fim (nao puxe a tela pra cima).
- Ao mexer numa edge function, mude so o necessario; cada deploy e versionado no
  Supabase (da pra reverter).

## Onboarding de cliente novo
Criar, na ordem: linha em `companies` (slug + name + contexto), usuario de acesso
(auth) e linha em `profiles` ligando o usuario a empresa. Nao ha gatilho automatico.

## Regras de trabalho (economia de tokens e edicao segura)
- Antes de qualquer alteracao, olhe a estrutura (`ls`, tamanhos) em vez de abrir
  arquivos de cara. Nunca leia um arquivo inteiro so para "ter contexto". Use
  grep/Grep para achar a secao e leia so a faixa relevante. Evite reler o que ja
  foi lido nesta conversa.
- Antes de editar: diga **quais arquivos** vai mudar e **por que**; so entao edite.
  Nao e preciso aprovar linha a linha, mas o alvo e o motivo precisam ficar claros.
- Prefira diffs curtos e cirurgicos a reescritas grandes. Nao apague codigo/dados
  sem avisar. Nao invente libs, endpoints ou APIs que nao existem.
- Verificacao e manual: para o frontend, renderizar/abrir a tela afetada (ver
  Comandos); para edge functions, deploy pequeno e testavel por funcao.
- Ao terminar, resuma de forma direta o que mudou (arquivos, trechos, motivo).
