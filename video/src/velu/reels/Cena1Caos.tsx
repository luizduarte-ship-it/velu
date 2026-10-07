import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { backgrounds, colors, fonts } from "../brand";
import { CardEmpresa, clamp, ease, rnd, Silhueta, Titulo } from "./ui";

const N_CARDS = 18;

// Cena 1 (0 a 120): a pessoa procurando cliente um por um e sendo soterrada
// por cartoes de empresa. E o gancho, tem que prender em dois segundos.
export const Cena1Caos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;

  // Frame 100 em diante tudo congela: a pilha para e segura a respiracao.
  const congelado = Math.min(frame, 100);

  return (
    <AbsoluteFill style={{ background: backgrounds.light, overflow: "hidden" }}>
      <Silhueta
        unit={unit}
        postura="caida"
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          translate: "-50% -40%",
          opacity: 0.9,
        }}
      />

      {new Array(N_CARDS).fill(0).map((_, i) => {
        const atraso = 6 + i * 3.6;
        const entrada = spring({
          frame: congelado - atraso,
          fps,
          config: { damping: 16, stiffness: 95, mass: 0.9 },
        });
        // espalhados de forma uniforme pela largura e empilhando de cima da
        // pessoa para baixo, para ela realmente sumir sob a pilha
        const x = 14 + ((i * 41) % 100) * 0.72 + (rnd(i, 1) - 0.5) * 10;
        const yFinal = 40 + (i / N_CARDS) * 46 + (rnd(i, 2) - 0.5) * 7;
        const giro = (rnd(i, 3) - 0.5) * 24;

        return (
          <CardEmpresa
            key={i}
            unit={unit}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${interpolate(entrada, [0, 1], [-28, yFinal])}%`,
              translate: "-50% -50%",
              rotate: `${interpolate(entrada, [0, 1], [giro * 2.6, giro])}deg`,
              opacity: interpolate(entrada, [0, 0.18], [0, 1], clamp),
            }}
          />
        );
      })}

      {/* cursor de busca piscando: ela catando um por um */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "27%",
          translate: "-50% 0",
          display: "flex",
          alignItems: "center",
          gap: 14 * unit,
          padding: `${14 * unit}px ${26 * unit}px`,
          borderRadius: 999,
          background: "#fff",
          boxShadow: `0 ${10 * unit}px ${26 * unit}px rgba(6,20,44,.14)`,
          opacity: interpolate(frame, [4, 16, 92, 100], [0, 1, 1, 0], clamp),
        }}
      >
        <svg viewBox="0 0 24 24" width={30 * unit} height={30 * unit} fill="none" stroke={colors.navy3} strokeWidth={2.4}>
          <circle cx={11} cy={11} r={7} />
          <path d="M16 16l5 5" strokeLinecap="round" />
        </svg>
        <div
          style={{
            width: 3 * unit,
            height: 32 * unit,
            background: colors.blue,
            opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
          }}
        />
      </div>

      <Titulo
        unit={unit}
        kicker="A MANHÃ INTEIRA"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "11%",
          opacity: interpolate(frame, [20, 34], [0, 1], { ...clamp, easing: Easing.bezier(...ease) }),
          translate: `0 ${interpolate(frame, [20, 34], [26 * unit, 0], { ...clamp, easing: Easing.bezier(...ease) })}px`,
        }}
      >
        Procurar cliente
        <br />
        um por um
      </Titulo>

      {/* contador cru, so pra dar a sensacao de esforco repetido */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "9%",
          textAlign: "center",
          fontFamily: fonts.kicker,
          fontSize: 30 * unit,
          letterSpacing: 4 * unit,
          color: colors.blue,
          opacity: interpolate(frame, [40, 54, 94, 102], [0, 1, 1, 0], clamp),
        }}
      >
        {String(Math.round(interpolate(congelado, [40, 100], [1, 5], clamp))).padStart(2, "0")} CONTATOS
      </div>
    </AbsoluteFill>
  );
};
