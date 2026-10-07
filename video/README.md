# Videos da VELU (Remotion)

Videos de motion da marca feitos em codigo (React) com [Remotion](https://remotion.dev).

## Primeira vez
Precisa do Node.js (versao LTS, nodejs.org). Depois, dentro desta pasta:

```
npm install
```

## Uso
- `npm run dev`: abre o Remotion Studio no navegador para ver e ajustar o video.
- `npm run render`: exporta `out/velu-intro.mp4` (1920x1080).
- `npm run render:vertical`: exporta `out/velu-intro-vertical.mp4` (1080x1920, Reels/Stories).

## Onde mexer
- `src/velu/brand.ts`: cores, fontes e tagline da marca.
- `src/velu/VeluIntro.tsx`: a intro base (logo, etiqueta e tagline).
- `src/Root.tsx`: lista de videos (cada `<Composition>` e um video).

Com o Claude Code ou Codex aberto na raiz do repo, as skills do Remotion ja
estao instaladas: e so pedir o video em portugues.
