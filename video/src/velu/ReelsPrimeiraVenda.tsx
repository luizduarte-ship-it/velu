import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { Cena1Caos } from "./reels/Cena1Caos";
import { Cena2Busca } from "./reels/Cena2Busca";
import { Cena3Preco } from "./reels/Cena3Preco";
import { Cena4Pipeline } from "./reels/Cena4Pipeline";
import { Cena5Venda } from "./reels/Cena5Venda";
import { Cena6Fecho } from "./reels/Cena6Fecho";

export const reelsSchema = z.object({
  volumeEfeitos: z.number().min(0).max(1),
});

type Props = z.infer<typeof reelsSchema>;

export const reelsDefaults: Props = { volumeEfeitos: 0.75 };

// Reels "Do contato a primeira venda": 30s, 900 frames a 30fps.
// Seis cenas emendadas sem respiro. Ver video/BRIEF-reels-primeira-venda.md.
//
// Marcas de tempo (em frames, 30fps):
//   0   caos        a pessoa soterrada procurando um por um
//   120 busca       a Velu entra, varre o caos e puxa os leads
//   270 preco       porte e receita viram valor sugerido e gancho
//   450 pipeline    o card anda entre as colunas, tarefas com prazo
//   630 venda       o card vira, carimbo e confete
//   810 fecho       logo, tagline e site
export const ReelsPrimeiraVenda: React.FC<Props> = ({ volumeEfeitos }) => {
  const { fps } = useVideoConfig();

  // Os ticks da lista de leads da cena 2: um por linha, bem baixos.
  const ticks = new Array(8).fill(0).map((_, i) => 120 + 50 + i * 7);

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120} premountFor={fps}>
        <Cena1Caos />
      </Sequence>
      <Sequence from={120} durationInFrames={150} premountFor={fps}>
        <Cena2Busca />
      </Sequence>
      <Sequence from={270} durationInFrames={180} premountFor={fps}>
        <Cena3Preco />
      </Sequence>
      <Sequence from={450} durationInFrames={180} premountFor={fps}>
        <Cena4Pipeline />
      </Sequence>
      <Sequence from={630} durationInFrames={180} premountFor={fps}>
        <Cena5Venda />
      </Sequence>
      <Sequence from={810} durationInFrames={90} premountFor={fps}>
        <Cena6Fecho />
      </Sequence>

      {/* Som. O impacto do carimbo e o pico; os ticks sao textura.
          `from` atrasa o item na timeline; `startFrom` cortaria o arquivo. */}
      <Audio src={staticFile("sfx/whoosh.wav")} from={120} premountFor={fps} volume={volumeEfeitos} />
      <Audio src={staticFile("sfx/whoosh.wav")} from={450} premountFor={fps} volume={volumeEfeitos * 0.6} />
      {ticks.map((f) => (
        <Audio key={f} src={staticFile("sfx/tick.wav")} from={f} premountFor={fps} volume={volumeEfeitos * 0.22} />
      ))}
      <Audio src={staticFile("sfx/coin.wav")} from={270 + 66} premountFor={fps} volume={volumeEfeitos * 0.5} />
      <Audio src={staticFile("sfx/impact.wav")} from={630 + 52} premountFor={fps} volume={volumeEfeitos} />

    </AbsoluteFill>
  );
};
