import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { backgrounds, colors, fonts, tagline } from "../brand";
import { clamp, ease } from "./ui";

// Cena 6 (810 a 900): fundo escurece, logo e tagline. Fecha parado.
export const Cena6Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;

  const selo = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 120 } });
  const linha = (atraso: number) =>
    interpolate(frame, [atraso, atraso + 14], [0, 1], { ...clamp, easing: Easing.bezier(...ease) });

  return (
    <AbsoluteFill
      style={{
        background: backgrounds.dark,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${colors.blue2}30 0%, transparent 56%)`,
          opacity: interpolate(frame, [0, 24], [0, 1], clamp),
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34 * unit,
        }}
      >
        <div
          style={{
            width: 200 * unit,
            height: 200 * unit,
            borderRadius: 52 * unit,
            background: colors.navy,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 ${24 * unit}px ${60 * unit}px rgba(0,0,0,.45)`,
            scale: interpolate(selo, [0, 1], [0.5, 1], clamp),
            opacity: interpolate(selo, [0, 0.25], [0, 1], clamp),
          }}
        >
          <Img src={staticFile("velu-logo.png")} style={{ width: 122 * unit }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: fonts.title,
              fontWeight: 700,
              fontSize: 72 * unit,
              letterSpacing: -2 * unit,
              color: "#fff",
              opacity: linha(18),
              translate: `0 ${interpolate(linha(18), [0, 1], [26 * unit, 0])}px`,
            }}
          >
            {tagline.part1}
          </div>
          <div
            style={{
              fontFamily: fonts.title,
              fontWeight: 700,
              fontSize: 72 * unit,
              letterSpacing: -2 * unit,
              color: colors.blue2,
              marginTop: 6 * unit,
              opacity: linha(28),
              translate: `0 ${interpolate(linha(28), [0, 1], [26 * unit, 0])}px`,
            }}
          >
            {tagline.part2}
          </div>
        </div>

        <div
          style={{
            fontFamily: fonts.kicker,
            fontSize: 34 * unit,
            letterSpacing: 6 * unit,
            color: "#fff",
            opacity: interpolate(linha(42), [0, 1], [0, 0.85], clamp),
          }}
        >
          VELUCRM.COM
        </div>
      </div>
    </AbsoluteFill>
  );
};
