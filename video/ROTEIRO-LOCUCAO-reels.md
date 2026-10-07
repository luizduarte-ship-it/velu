# Locução do Reels "Do contato à primeira venda"

Texto de narração para o vídeo de 30s (`ReelsPrimeiraVenda`). Serve para gravar
com uma pessoa ou para gerar no ElevenLabs.

São **64 palavras**, cerca de 24 segundos falados dentro dos 30. A sobra é
respiro: não tente preencher.

---

## 1. Para mandar para quem vai gravar

O vídeo já tem texto na tela. **A locução não lê o que está escrito**, ela
complementa. Então nada de forçar: é alguém contando como funciona, não
locutor de propaganda.

| Tempo | O que falar | Como falar |
|---|---|---|
| 0:00 › 0:04 | Quanto tempo você perde atrás de cliente? | Pergunta de verdade, sem sorrir. É o gancho, grave três vezes. |
| 0:04 › 0:09 | Escolhe o nicho, escolhe a região. A Velu vasculha a base de CNPJ sozinha. | Acelera, é a virada. As duas partes emendadas, e "sozinha" com ênfase. |
| 0:09 › 0:15 | Cada lead chega com valor sugerido e com o gancho pra abrir a conversa. | Desacelera. "Valor sugerido" é a informação mais importante do vídeo. |
| 0:15 › 0:21 | Vira pipeline, vira tarefa com prazo. Você sabe o que fazer hoje. | Tom de alívio. O "vira, vira" é ritmado, aproveite a repetição. |
| 0:21 › 0:27 | E aí é só fechar. Do primeiro contato até a primeira venda. | Sobe um pouco. "Primeira venda" é o pico. |
| 0:27 › 0:30 | Velu. CRM com inteligência artificial. | Seco e calmo. Não alongue. |

**Pronúncia:** `Velu` é **VÉ-lu**, força na primeira sílaba, não "velú" nem
"vêlu". `lead` lê-se **"líde"**, como em inglês, é como o mercado fala.

**Como gravar:** celular ou microfone de fone serve, desde que num cômodo com
pano, sofá ou cortina (banheiro e cozinha ecoam). Boca a um palmo do
microfone, sem estourar o "p". Grave o texto inteiro de uma vez, três vezes
seguidas, e mande as três. A montagem escolhe. Mande o arquivo original, nunca
por áudio de WhatsApp, que comprime e perde qualidade.

---

> Testamos TTS (ElevenLabs e Seed Audio) e o resultado ficou mecânico demais
> em português. A locução vai ser gravada por uma pessoa. A seção abaixo fica
> registrada caso a gente volte a precisar.

## 2. Para colar no ElevenLabs

Texto corrido, já com as pausas marcadas. É só copiar o bloco:

```
Quanto tempo você perde atrás de cliente? <break time="0.7s" />
Escolhe o nicho, escolhe a região. <break time="0.3s" /> A Velu vasculha a base de cê êne pê jota sozinha. <break time="0.5s" />
Cada lead chega com valor sugerido <break time="0.25s" /> e com o gancho pra abrir a conversa. <break time="0.5s" />
Vira pipeline, vira tarefa com prazo. <break time="0.3s" /> Você sabe o que fazer hoje. <break time="0.5s" />
E aí é só fechar. <break time="0.3s" /> Do primeiro contato até a primeira venda. <break time="0.7s" />
Velu. <break time="0.25s" /> Cê erre eme com inteligência artificial.
```

**Por que CNPJ e CRM estão escritos por extenso:** em sigla, o modelo às vezes
tenta ler como palavra ("cenpej", "crem"). Escrever o som resolve. Se a voz que
você escolher já acertar a sigla, troque de volta para `CNPJ` e `CRM`, que sai
mais natural.

**Se for usar o site no fim**, escreva `velucrm ponto com`, nunca
`velucrm.com`: com ponto ele lê como fim de frase e engole.

### Configuração sugerida

| Campo | Valor | Motivo |
|---|---|---|
| Modelo | Multilingual v2 | melhor prosódia em português do que o Turbo |
| Idioma da voz | Português do Brasil | voz treinada em inglês falando português fica com sotaque |
| Stability | 40 a 50 | abaixo disso varia demais entre frases, acima fica robótico |
| Similarity | 75 | |
| Style exaggeration | 0 a 15 | acima disso vira locutor de comercial de TV |
| Speaker boost | ligado | |
| Speed | 1.0 | se passar de 30s, suba para 1.05, não corte texto |

Gere **três versões** com seeds diferentes e escute antes de escolher. O
ElevenLabs erra entonação de pergunta com frequência: confira principalmente a
primeira frase.

---

## 3. Como colocar no vídeo

Salve o arquivo como `video/public/locucao.mp3` e adicione em
`video/src/velu/ReelsPrimeiraVenda.tsx`, junto dos outros `<Audio>`:

```tsx
<Audio src={staticFile("locucao.mp3")} premountFor={fps} volume={1} />
```

**Abaixe os efeitos sonoros junto.** A composição já expõe `volumeEfeitos`
como prop: com locução, troque o padrão de `0.75` para **`0.45`** em
`reelsDefaults`, ou ajuste no Studio sem mexer no código. Efeito sonoro
competindo com voz é o erro mais comum.

Se a locução ficar mais curta ou mais longa que a cena, **não mexa no texto**:
mova o `from` do `<Audio>` alguns frames para encaixar a primeira sílaba no
corte da cena 1.

---

## O que não pode mudar no texto

- Nada que diga que a Velu **atende cliente, responde mensagem ou tem robô de
  WhatsApp**. Ela não faz isso.
- Nenhum número de resultado: quantidade de leads, porcentagem de aumento de
  venda, faturamento. O "valor sugerido" que aparece na tela é mock de
  interface, e a locução de propósito não diz nenhum valor.
- Sem travessão e sem hífen.
