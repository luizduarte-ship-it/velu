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
import { backgrounds, colors, fonts } from "../brand";
import { CardEmpresa, Check, Chip, clamp, ease, rnd, Titulo } from "./ui";

const N_CARDS = 18;
const N_LEADS = 8;

// Cena 2 (120 a 270): a logo entra pela direita, varre o caos e a Velu
// comeca a puxar os leads sozinha. E a virada do video.
export const Cena2Busca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;

  const logo = spring({ frame, fps, config: { damping: 11, stiffness: 120, mass: 0.8 } });

  return (
    <AbsoluteFill style={{ background: backgrounds.light, overflow: "hidden" }}>
      {/* os cartoes da cena 1 sendo varridos para fora, um a cada 2 frames */}
      {new Array(N_CARDS).fill(0).map((_, i) => {
        const saida = spring({
          frame: frame - 4 - i * 2,
          fps,
          config: { damping: 14, stiffness: 150, mass: 0.7 },
        });
        const x = 14 + ((i * 41) % 100) * 0.72 + (rnd(i, 1) - 0.5) * 10;
        const y = 40 + (i / N_CARDS) * 46 + (rnd(i, 2) - 0.5) * 7;
        const giro = (rnd(i, 3) - 0.5) * 24;
        return (
          <CardEmpresa
            key={i}
            unit={unit}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              translate: `${interpolate(saida, [0, 1], [-50, -50 - 200 * (0.6 + rnd(i, 4))])}% -50%`,
              rotate: `${interpolate(saida, [0, 1], [giro, giro - 50])}deg`,
              opacity: interpolate(saida, [0, 0.85], [1, 0], clamp),
            }}
          />
        );
      })}

      {/* selo navy com a logo, entrando pela direita */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "17%",
          translate: `${interpolate(logo, [0, 1], [460, -50], clamp)}% -50%`,
          width: 186 * unit,
          height: 186 * unit,
          borderRadius: 48 * unit,
          background: colors.navy,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${22 * unit}px ${52 * unit}px rgba(6,20,44,.3)`,
          rotate: `${interpolate(logo, [0, 1], [-22, 0], clamp)}deg`,
        }}
      >
        <Img src={staticFile("velu-logo.png")} style={{ width: 112 * unit }} />
      </div>

      {/* chips de filtro */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "32%",
          display: "flex",
          justifyContent: "center",
          gap: 20 * unit,
        }}
      >
        {["nicho", "região"].map((t, i) => {
          const s = spring({ frame: frame - 26 - i * 7, fps, config: { damping: 13, stiffness: 130 } });
          return (
            <Chip
              key={t}
              unit={unit}
              style={{
                scale: interpolate(s, [0, 1], [0.3, 1], clamp),
                opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
                translate: `0 ${interpolate(s, [0, 1], [30 * unit, 0])}px`,
              }}
            >
              <span style={{ color: colors.blue }}>#</span>
              {t}
            </Chip>
          );
        })}
      </div>

      {/* lista de leads se preenchendo de baixo para cima */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          translate: "-50% 0",
          width: 760 * unit,
          display: "flex",
          flexDirection: "column",
          gap: 14 * unit,
        }}
      >
        {new Array(N_LEADS).fill(0).map((_, i) => {
          const t0 = 50 + i * 7;
          const s = spring({ frame: frame - t0, fps, config: { damping: 15, stiffness: 140, mass: 0.7 } });
          const check = interpolate(frame, [t0 + 9, t0 + 15], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20 * unit,
                padding: `${20 * unit}px ${26 * unit}px`,
                borderRadius: 18 * unit,
                background: "#fff",
                boxShadow: `0 ${10 * unit}px ${26 * unit}px rgba(6,20,44,.1)`,
                opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
                translate: `0 ${interpolate(s, [0, 1], [48 * unit, 0])}px`,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 16 * unit,
                  borderRadius: 8 * unit,
                  background: colors.navy3,
                  opacity: 0.4,
                  maxWidth: `${52 + rnd(i, 9) * 34}%`,
                }}
              />
              <Check
                unit={unit}
                style={{ scale: interpolate(check, [0, 1], [0.2, 1], clamp), opacity: check }}
              />
            </div>
          );
        })}
      </div>

      {/* barra de progresso da busca */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "16%",
          translate: "-50% 0",
          width: 760 * unit,
          height: 10 * unit,
          borderRadius: 999,
          background: "rgba(17,108,254,.16)",
          overflow: "hidden",
          opacity: interpolate(frame, [48, 58], [0, 1], clamp),
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 999,
            background: colors.blue,
            width: `${interpolate(frame, [52, 124], [0, 100], clamp)}%`,
          }}
        />
      </div>

      <Titulo
        unit={unit}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "7%",
          opacity: interpolate(frame, [30, 44], [0, 1], { ...clamp, easing: Easing.bezier(...ease) }),
        }}
      >
        A Velu <span style={{ color: colors.blue }}>busca sozinha</span>
      </Titulo>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "11.5%",
          textAlign: "center",
          fontFamily: fonts.kicker,
          fontSize: 26 * unit,
          letterSpacing: 5 * unit,
          color: colors.blue,
          opacity: interpolate(frame, [58, 70], [0, 1], clamp),
        }}
      >
        BASE PÚBLICA DE CNPJ
      </div>
    </AbsoluteFill>
  );
};
