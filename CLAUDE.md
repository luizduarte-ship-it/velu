# VELU — contexto do projeto

Este arquivo orienta o Claude Code. Leia antes de mexer em qualquer coisa.

## O que é
VELU é um SaaS de inteligência comercial (CRM + IA) vendido para várias
empresas. Cada empresa cliente é uma linha na tabela `companies`; o mesmo
sistema atende todas, e o contexto de cada uma é injetado em tempo de
execução. A IA do produto se chama "Velu".

## Arquitetura
- Frontend: um único arquivo `index.html` (HTML + CSS + JavaScript puro, sem
  build, sem framework). Usa o cliente supabase-js via CDN. Para publicar,
  basta subir o arquivo no host.
- Backend: Supabase (projeto hjtdkfrlogktvmkeauwf, região sa-east-1).
  Postgres com RLS, multi-tenant (o usuário só enxerga a própria empresa).
  Edge Functions em Deno/TypeScript em supabase/functions/<slug>/index.ts.

## Edge functions principais
- chat: o cérebro da IA. Monta o system prompt por modo (empresa, livre,
  code), injeta contexto da empresa, memória, skills (seleção automática pela
  mensagem) e arquivos, e faz streaming da resposta da Anthropic com busca web.
- find-leads: geração de leads. Interpreta nicho ou intenção ampla, pesquisa
  na web (streaming, orçamento de ~120s), valida e grava em `leads`, com
  gancho de abordagem por lead.
- profile-company: coleta o perfil público da empresa e preenche companies.profile.
- learn: memória contínua (ai_memories).
- Outras: analyze, image, video-assist, lead-worker (cron), lead-pipeline-health.

## Tabelas centrais
companies (contexto por cliente: name, sector, positioning, icp, tone, rules,
description, profile), profiles (usuário -> company_id), competitors +
competitor_notes (dossiês), leads (pipeline, campos stage e campaign_hook),
lead_runs, skills, conversations, messages, ai_memories, files, lead_evidence.

## Convenções (importantes)
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
