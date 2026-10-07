# Brief: Reels "Do contato à primeira venda"

Prompt de produção para o Claude Code executar dentro deste projeto Remotion.
Cole o conteúdo inteiro deste arquivo como mensagem, ou diga
"executa o `video/BRIEF-reels-primeira-venda.md`".

---

## O que construir

Um Reels de **30 segundos** que mostra a jornada completa dentro da Velu: a
pessoa afogada procurando cliente, a Velu puxando os leads sozinha, o preço
sugerido aparecendo, o card andando no pipeline e a primeira venda fechando.
Rápido, denso, com ícone voando e número virando, mas sem virar poluição.

**Composição:** `ReelsPrimeiraVenda`, 1080x1920, 30 fps, 900 frames.
Registrar em `video/src/Root.tsx`. Componente em
`video/src/velu/ReelsPrimeiraVenda.tsx`, cenas em
`video/src/velu/reels/` (uma por arquivo).

---

## Regras técnicas, não negociáveis

Carregue a skill `remotion-best-practices` antes de escrever qualquer linha.

1. **Toda animação sai de `useCurrentFrame()`** com `interpolate()` ou
   `spring()`. CSS `transition` e `@keyframes` **não renderizam** no Remotion:
   o render tira um print por frame, não existe tempo passando.
2. Pegue `fps`, `width` e `height` de `useVideoConfig()`. Nunca escreva `30`
   direto para tempo: use `0.4 * fps`.
3. Escale tudo por `const unit = Math.min(width, height) / 1080`, igual o
   `VeluIntro.tsx` já faz. Nada em pixel absoluto.
4. Todo `interpolate()` leva
   `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }`.
5. Cada cena é uma `<Sequence from={...} durationInFrames={...}>`. Dentro da
   Sequence o frame volta a zero, então cada cena anima a partir do próprio 0.
6. Cores, fontes e tagline **só** de `./brand.ts`. Nunca hex solto no
   componente. Regra da marca: **nunca texto cinza**, só navy ou azul.
7. Props tipadas com `zod`, igual ao `VeluIntro`, para dar para editar no
   Studio.
8. Preferir `spring()` nas entradas de elemento (dá peso) e `interpolate()`
   com `Easing.bezier(0.16, 1, 0.3, 1)` nos movimentos longos de câmera.

---

## Linha do tempo

Tempo em frames a 30 fps. Os seis blocos emendam sem respiro: é Reels, não
pode ter buraco.

### Cena 1 · O caos (0 a 120 · 0:00 a 0:04)

O gancho. Tem que prender em dois segundos.

- Fundo `backgrounds.light`.
- Uma **silhueta de pessoa** ao centro, pequena, estática, ombros caídos.
- Em volta dela, **14 cartõezinhos cinza-azulados** (placeholders de empresa:
  retângulo com duas linhas falsas dentro) caindo do topo em tempos
  escalonados, com `spring()` e rotação aleatória entre -12 e 12 graus. Eles
  se acumulam e **cobrem a pessoa** até o frame 95.
- Um cursor de busca piscando no alto, como se ela estivesse catando um por um.
- Frame 100: tudo congela por 6 frames (pausa seca).
- Texto que entra no frame 20, em cima: **"Procurar cliente um por um"**,
  `fonts.title`, navy, e logo abaixo em `fonts.kicker` azul:
  **"A MANHÃ INTEIRA"**.

### Cena 2 · A Velu entra (120 a 270 · 0:04 a 0:09)

A virada. É o momento mais importante do vídeo.

- Frame 120: a logo da Velu (`staticFile("velu-logo.png")`, dentro do selo
  navy arredondado) **entra pela direita** com `spring()` de damping baixo, e
  no impacto os 14 cartões do caos são **varridos para fora** do quadro, cada
  um com delay próprio de 2 frames.
- Em seguida, dois **chips de filtro** pousam lado a lado: `nicho` e `região`,
  pílulas brancas com sombra, entrando com `spring()`.
- Frame 170 em diante: uma **lista de leads se preenchendo de baixo para
  cima**, 8 linhas, cada uma entrando a cada 7 frames, com nome falso de
  empresa borrado (barrinha) e um check azul acendendo no fim de cada linha.
- Uma **barra de progresso** fina azul correndo de 0 a 100 por cima da lista.
- Texto: **"A Velu busca sozinha"**.

### Cena 3 · O preço (270 a 450 · 0:09 a 0:15)

- Um dos cards da lista **sobe e cresce** para o centro, virando um card de
  lead aberto. Os outros desfocam e descem.
- Três ícones orbitam o card e **são sugados para dentro dele**, um a cada 12
  frames: um **prédio** (porte), um **gráfico de barras** (receita) e uma
  **moeda** (valor). Use `interpolate()` em trajetória curva, não em linha
  reta.
- Quando o terceiro entra, o campo de valor do card **conta de 0 até o número**
  com `interpolate()` + `Math.round()`, formatado em BRL.
- Logo abaixo acende o **gancho de abordagem**, uma linha de texto digitando
  caractere a caractere (`slice` do texto pelo frame, não é animação de CSS).
- Texto: **"Ela diz quanto cobrar"**.

### Cena 4 · O pipeline (450 a 630 · 0:15 a 0:21)

- A câmera dá um **zoom out** e revela três colunas de pipeline.
- O card do lead **viaja da coluna 1 para a 3**, em arco, com `spring()` em
  cada parada. Nas paradas ele dá uma inclinada de 3 graus e volta.
- Ao lado, **três tarefas** aparecem empilhadas com etiqueta de urgência
  (urgente, moderada, leve) e um prazo. Cada uma ganha um check em sequência.
- Pequenos ícones voando ao fundo, bem discretos e desfocados: celular,
  monitor, envelope. **No máximo cinco**, com opacidade baixa. Eles são
  textura, não protagonista.
- Texto: **"Nada se perde"**.

### Cena 5 · A venda (630 a 810 · 0:21 a 0:27)

- O card chega na coluna final e **vira para cima**, com `rotateY` saindo de
  90 para 0 (use `perspective`).
- Um **carimbo de fechado** bate em cima com `spring()` de overshoot alto, e
  no impacto solta um **anel de onda** que expande e some.
- Confete **contido**: no máximo 18 pedaços, só nas cores da marca, caindo com
  rotação. Nada de festa genérica.
- A silhueta da cena 1 **reaparece em pé**, ombro no lugar.
- Texto: **"Primeira venda"**.

### Cena 6 · Fecho (810 a 900 · 0:27 a 0:30)

- Tudo some para cima. Fundo passa para `backgrounds.dark`.
- Logo no selo navy ao centro, `tagline.part1` e `tagline.part2` entrando em
  duas linhas, e `velucrm.com` embaixo.
- Último frame segura meio segundo parado.

---

## Som

Quatro efeitos, sintetizados e colocados em `video/public/sfx/`, montados com
`<Audio src={staticFile("sfx/...")} startFrom={...} />` dentro da Sequence da
cena. Sem trilha com direitos.

| Arquivo | Onde | O que é |
|---|---|---|
| `whoosh.wav` | 120 (entrada da logo) e 450 (zoom out) | varrida de ruído com filtro passa-baixa subindo |
| `tick.wav` | cada linha da lista na cena 2 | clique curto e seco, bem baixo |
| `coin.wav` | 270 em diante, quando o valor conta | duas senoides curtas subindo |
| `impact.wav` | 700 (o carimbo) | grave curto com queda de tom |

Mixagem: o impacto é o pico. Os ticks ficam **bem abaixo**, são textura. Se na
dúvida, abaixe: efeito sonoro estourado é a marca de vídeo amador.

---

## Identidade

Tudo sai de `video/src/velu/brand.ts`:

- `colors.navy` `#06142C`, `colors.blue` `#116CFE`, `colors.blue2` `#3E8BFF`
- `backgrounds.light` nas cenas 1 a 5, `backgrounds.dark` na 6
- `fonts.title` Instrument Sans 700 nos títulos
- `fonts.kicker` IBM Plex Mono, maiúsculo, azul, nas etiquetas
- Logo clara: só sobre fundo escuro ou dentro do selo navy

Texto na tela: **curto**. Nenhuma frase passa de cinco palavras. Em Reels
ninguém lê parágrafo.

---

## O que não pode entrar

- Nada que sugira que a Velu **atende cliente, responde mensagem ou tem robô
  de WhatsApp**. Ela não faz isso. A jornada é: acha o lead, sugere o preço,
  organiza o retorno, você fecha.
- Nenhum número apresentado como resultado real: quantidade de leads,
  porcentagem de aumento de venda, faturamento. O valor que aparece no card da
  cena 3 é **mock de interface**, escolha um valor redondo e comum.
- Nenhum nome de empresa real nos cards. Use barrinhas borradas ou nomes
  claramente fictícios.
- Sem travessão e sem hífen em texto de tela.
- Sem degradê exagerado, brilho de néon ou aquele visual de "feito por IA".
  A referência é interface limpa em movimento, não motion de banco digital.

---

## Como verificar

```bash
cd video
npm run dev          # Studio, para ver scrubando frame a frame
npx tsc --noEmit     # tipos
npx eslint src       # lint
npm run render:vertical
```

Nesta sessão remota o render precisa do binário local, porque o host de
download do Remotion está bloqueado:

```bash
npx remotion render ReelsPrimeiraVenda out/reels-primeira-venda.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Antes de dar por pronto, **renderize stills nos frames 60, 200, 360, 540, 720 e
870** e olhe um por um: nenhum texto cortado, nada sobreposto, nenhum elemento
parado onde devia estar se movendo.

---

## Decisões em aberto

**A pessoa.** O brief assume **silhueta vetorial** desenhada em código, que é o
que fecha com a linguagem de interface e renderiza sem depender de asset. As
alternativas são usar as fotos surreais já geradas (ficam em outro registro
visual, mais editorial) ou não ter pessoa nenhuma, só interface. Decidir antes
de começar a cena 1.
