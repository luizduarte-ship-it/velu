import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { backgrounds, colors, fonts } from "../brand";
import { Check, clamp, ease, Icone, rnd, Titulo, type IconeNome } from "./ui";

const COLUNAS = ["Contato", "Proposta", "Fechamento"];
const TAREFAS: { txt: string; urg: string; cor: string; prazo: string }[] = [
  { txt: "Ligar de volta", urg: "URGENTE", cor: "#E8502E", prazo: "hoje" },
  { txt: "Mandar proposta", urg: "MODERADA", cor: colors.blue, prazo: "amanhã" },
  { txt: "Confirmar escopo", urg: "LEVE", cor: colors.navy3, prazo: "sexta" },
];
const FUNDO: IconeNome[] = ["celular", "monitor", "envelope", "grafico", "moeda"];

// Cena 4 (450 a 630): zoom out, o card viaja entre as colunas do pipeline e
// as tarefas vao sendo marcadas.
export const Cena4Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;

  const zoom = interpolate(frame, [0, 26], [1.5, 1], { ...clamp, easing: Easing.bezier(...ease) });

  // o card para em cada coluna; cada parada e uma mola
  const p1 = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 120 } });
  const p2 = spring({ frame: frame - 62, fps, config: { damping: 14, stiffness: 120 } });
  const col = p1 + p2; // 0 -> 1 -> 2
  const xPct = interpolate(col, [0, 1, 2], [17, 50, 83]);
  // arco: sobe no meio do caminho entre as colunas
  const arco = Math.sin(Math.min(col, 2) * Math.PI) * -46;
  const inclina = Math.sin(Math.min(col, 2) * Math.PI * 2) * 3;

  return (
    <AbsoluteFill style={{ background: backgrounds.light, overflow: "hidden" }}>
      {/* icones de textura ao fundo, desfocados e discretos */}
      {FUNDO.map((nome, i) => {
        const sobe = interpolate(frame, [i * 14, i * 14 + 150], [0, -230], clamp);
        return (
          <Icone
            key={nome}
            nome={nome}
            unit={unit}
            size={120}
            cor={colors.blue}
            style={{
              position: "absolute",
              left: `${8 + rnd(i, 5) * 84}%`,
              top: `${74 + rnd(i, 6) * 20}%`,
              translate: `-50% ${sobe * unit}px`,
              rotate: `${(rnd(i, 7) - 0.5) * 40}deg`,
              opacity: 0.1,
              filter: "blur(2px)",
            }}
          />
        );
      })}

      <AbsoluteFill style={{ scale: zoom }}>
        {/* colunas */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "16%",
            translate: "-50% 0",
            width: 980 * unit,
            display: "flex",
            gap: 20 * unit,
          }}
        >
          {COLUNAS.map((c, i) => (
            <div
              key={c}
              style={{
                flex: 1,
                height: 620 * unit,
                borderRadius: 28 * unit,
                background: "rgba(255,255,255,.72)",
                border: `${2 * unit}px solid rgba(17,108,254,.16)`,
                padding: 20 * unit,
                opacity: interpolate(frame, [i * 5, i * 5 + 16], [0, 1], clamp),
              }}
            >
              <div
                style={{
                  fontFamily: fonts.kicker,
                  fontSize: 20 * unit,
                  letterSpacing: 3 * unit,
                  color: colors.blue,
                  textTransform: "uppercase",
                }}
              >
                {c}
              </div>
            </div>
          ))}
        </div>

        {/* o card viajando */}
        <div
          style={{
            position: "absolute",
            left: `${xPct}%`,
            top: `${26 + arco * 0.12}%`,
            translate: "-50% 0",
            rotate: `${inclina}deg`,
            width: 272 * unit,
            padding: 24 * unit,
            borderRadius: 20 * unit,
            background: "#fff",
            boxShadow: `0 ${18 * unit}px ${40 * unit}px rgba(6,20,44,.24)`,
          }}
        >
          <div style={{ height: 14 * unit, width: "70%", borderRadius: 7 * unit, background: colors.navy3, opacity: 0.45 }} />
          <div
            style={{
              marginTop: 14 * unit,
              fontFamily: fonts.title,
              fontWeight: 700,
              fontSize: 34 * unit,
              color: colors.blue,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            R$ 2.400
          </div>
        </div>
      </AbsoluteFill>

      {/* tarefas com urgencia e prazo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          translate: "-50% 0",
          width: 820 * unit,
          display: "flex",
          flexDirection: "column",
          gap: 16 * unit,
        }}
      >
        {TAREFAS.map((t, i) => {
          const t0 = 70 + i * 16;
          const s = spring({ frame: frame - t0, fps, config: { damping: 15, stiffness: 140, mass: 0.7 } });
          const ck = interpolate(frame, [t0 + 14, t0 + 20], [0, 1], clamp);
          return (
            <div
              key={t.txt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18 * unit,
                padding: `${22 * unit}px ${26 * unit}px`,
                borderRadius: 20 * unit,
                background: "#fff",
                boxShadow: `0 ${10 * unit}px ${26 * unit}px rgba(6,20,44,.1)`,
                opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
                translate: `${interpolate(s, [0, 1], [-50 * unit, 0])}px 0`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.kicker,
                  fontSize: 19 * unit,
                  letterSpacing: 2.5 * unit,
                  color: "#fff",
                  background: t.cor,
                  padding: `${8 * unit}px ${14 * unit}px`,
                  borderRadius: 8 * unit,
                }}
              >
                {t.urg}
              </div>
              <div style={{ flex: 1, fontFamily: fonts.title, fontWeight: 700, fontSize: 32 * unit, color: colors.navy }}>
                {t.txt}
              </div>
              <div style={{ fontFamily: fonts.kicker, fontSize: 22 * unit, color: colors.blue }}>{t.prazo}</div>
              <Check unit={unit} size={32} style={{ scale: interpolate(ck, [0, 1], [0.2, 1], clamp), opacity: ck }} />
            </div>
          );
        })}
      </div>

      <Titulo
        unit={unit}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "8%",
          opacity: interpolate(frame, [120, 134], [0, 1], { ...clamp, easing: Easing.bezier(...ease) }),
        }}
      >
        <span style={{ color: colors.blue }}>Nada</span> se perde
      </Titulo>
    </AbsoluteFill>
  );
};
