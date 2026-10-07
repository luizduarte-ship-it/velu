import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { backgrounds, colors, fonts, tagline } from "./brand";

export const veluIntroSchema = z.object({
  kicker: z.string(),
  line1: z.string(),
  line2: z.string(),
});

type Props = z.infer<typeof veluIntroSchema>;

export const veluIntroDefaults: Props = {
  kicker: "CRM COM INTELIGÊNCIA ARTIFICIAL",
  line1: tagline.part1,
  line2: tagline.part2,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Intro base da marca: logo, etiqueta e tagline entrando em sequencia.
// Serve de ponto de partida para os proximos videos.
export const VeluIntro: React.FC<Props> = ({ kicker, line1, line2 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const unit = Math.min(width, height) / 1080; // escala tudo pelo lado menor

  return (
    <AbsoluteFill
      style={{
        background: backgrounds.light,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.body,
      }}
    >
      {/* brilho azul suave ao fundo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${vertical ? 42 : 46}%, ${colors.blue2}33 0%, transparent 55%)`,
          opacity: interpolate(frame, [0, 1.5 * fps], [0, 1], { ...clamp, easing: ease }),
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28 * unit,
          padding: `0 ${80 * unit}px`,
          textAlign: "center",
        }}
      >
        {/* logo "V" (clara) dentro de um selo navy */}
        <div
          style={{
            width: 156 * unit,
            height: 156 * unit,
            borderRadius: 40 * unit,
            background: backgrounds.dark,
            boxShadow: `0 ${24 * unit}px ${60 * unit}px ${colors.blue}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], clamp),
            scale: interpolate(frame, [0, 0.9 * fps], [0.6, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 14 }),
            }),
          }}
        >
          <Img src={staticFile("velu-logo.png")} style={{ width: 96 * unit, height: "auto" }} />
        </div>

        <div
          style={{
            fontFamily: fonts.kicker,
            fontWeight: 500,
            fontSize: 26 * unit,
            letterSpacing: 6 * unit,
            textTransform: "uppercase",
            color: colors.blue,
            opacity: interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [0.6 * fps, 1.2 * fps], [16, 0], { ...clamp, easing: ease }) * unit}px`,
          }}
        >
          {kicker}
        </div>

        <div
          style={{
            fontFamily: fonts.title,
            fontWeight: 700,
            fontSize: (vertical ? 96 : 104) * unit,
            lineHeight: 1.05,
            letterSpacing: -2 * unit,
            color: colors.navy,
            opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [1.2 * fps, 1.9 * fps], [40, 0], { ...clamp, easing: ease }) * unit}px`,
          }}
        >
          {line1}
        </div>

        <div
          style={{
            fontFamily: fonts.title,
            fontWeight: 700,
            fontSize: (vertical ? 96 : 104) * unit,
            lineHeight: 1.05,
            letterSpacing: -2 * unit,
            color: colors.blue,
            opacity: interpolate(frame, [2.2 * fps, 2.9 * fps], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [2.2 * fps, 2.9 * fps], [40, 0], { ...clamp, easing: ease }) * unit}px`,
          }}
        >
          {line2}
        </div>

        <div
          style={{
            marginTop: 12 * unit,
            fontSize: 30 * unit,
            color: colors.navy3,
            opacity: interpolate(frame, [3.4 * fps, 4 * fps], [0, 1], clamp),
          }}
        >
          velucrm.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
