import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { backgrounds, colors, fonts } from "../brand";
import { clamp, ease, rnd, Silhueta, Titulo } from "./ui";

const N_CONFETE = 24;
const CARIMBO = 52; // frame do impacto dentro da cena

// Cena 5 (630 a 810): o card vira, o carimbo bate e a pessoa volta em pe.
export const Cena5Venda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;

  const vira = interpolate(frame, [6, 34], [90, 0], { ...clamp, easing: Easing.bezier(...ease) });
  const carimbo = spring({ frame: frame - CARIMBO, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const onda = interpolate(frame, [CARIMBO, CARIMBO + 18], [0, 1], clamp);
  const pessoa = spring({ frame: frame - 76, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ background: backgrounds.light, overflow: "hidden" }}>
      {/* anel de impacto */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          translate: "-50% -50%",
          width: 300 * unit,
          height: 300 * unit,
          borderRadius: "50%",
          border: `${6 * unit}px solid ${colors.blue}`,
          scale: interpolate(onda, [0, 1], [0.3, 3.4], clamp),
          opacity: interpolate(onda, [0, 0.1, 0.75], [0, 0.5, 0], clamp),
        }}
      />

      {/* card virando para cima */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          translate: "-50% -50%",
          perspective: 1200 * unit,
        }}
      >
        <div
          style={{
            width: 640 * unit,
            padding: 44 * unit,
            borderRadius: 36 * unit,
            background: "#fff",
            boxShadow: `0 ${24 * unit}px ${60 * unit}px rgba(6,20,44,.24)`,
            rotate: `y ${vira}deg`,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: fonts.kicker, fontSize: 24 * unit, letterSpacing: 5 * unit, color: colors.blue }}>
            FECHAMENTO
          </div>
          <div
            style={{
              fontFamily: fonts.title,
              fontWeight: 700,
              fontSize: 110 * unit,
              letterSpacing: -3 * unit,
              color: colors.navy,
              lineHeight: 1.1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            R$ 2.400
          </div>
        </div>
      </div>

      {/* carimbo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          translate: "-18% 118%",
          rotate: `${interpolate(carimbo, [0, 1], [-26, -8], clamp)}deg`,
          scale: interpolate(carimbo, [0, 1], [2.6, 1], clamp),
          opacity: interpolate(carimbo, [0, 0.15], [0, 1], clamp),
          padding: `${16 * unit}px ${34 * unit}px`,
          borderRadius: 14 * unit,
          border: `${5 * unit}px solid ${colors.blue}`,
          background: "rgba(255,255,255,.9)",
          fontFamily: fonts.title,
          fontWeight: 700,
          fontSize: 52 * unit,
          letterSpacing: 3 * unit,
          color: colors.blue,
        }}
      >
        GANHO
      </div>

      {/* confete contido, so nas cores da marca */}
      {new Array(N_CONFETE).fill(0).map((_, i) => {
        const t0 = CARIMBO + 2 + rnd(i, 21) * 10;
        const p = interpolate(frame, [t0, t0 + 70], [0, 1], clamp);
        const cor = [colors.blue, colors.blue2, colors.navy][i % 3];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${12 + rnd(i, 22) * 76}%`,
              top: "34%",
              translate: `-50% ${interpolate(p, [0, 1], [0, 620 * unit])}px`,
              width: 14 * unit,
              height: 22 * unit,
              borderRadius: 3 * unit,
              background: cor,
              rotate: `${interpolate(p, [0, 1], [0, 420 * (rnd(i, 23) > 0.5 ? 1 : -1)])}deg`,
              opacity: interpolate(p, [0, 0.08, 0.8, 1], [0, 1, 1, 0], clamp),
            }}
          />
        );
      })}

      {/* a pessoa da cena 1, agora em pe */}
      <Silhueta
        unit={unit}
        postura="ereta"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "16%",
          translate: `-50% ${interpolate(pessoa, [0, 1], [90 * unit, 0])}px`,
          opacity: interpolate(pessoa, [0, 0.3], [0, 0.92], clamp),
          scale: 0.74,
        }}
      />

      <Titulo
        unit={unit}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "7%",
          opacity: interpolate(frame, [CARIMBO + 6, CARIMBO + 20], [0, 1], { ...clamp, easing: Easing.bezier(...ease) }),
        }}
      >
        <span style={{ color: colors.blue }}>Primeira</span> venda
      </Titulo>
    </AbsoluteFill>
  );
};
