import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { backgrounds, colors, fonts } from "../brand";
import { brl, Check, clamp, ease, IconeBolha, Titulo, type IconeNome } from "./ui";

// Mock de interface, nao e resultado real de ninguem.
const VALOR_SUGERIDO = 2400;
const GANCHO = "Abriu filial nova este mes";

const ORBITA: { nome: IconeNome; de: [number, number]; t0: number }[] = [
  { nome: "predio", de: [-128, -84], t0: 26 },
  { nome: "grafico", de: [132, -56], t0: 38 },
  { nome: "moeda", de: [-26, 122], t0: 50 },
];

// Cena 3 (270 a 450): um lead sobe para o centro, porte, receita e valor sao
// sugados para dentro dele, o valor conta e o gancho digita.
export const Cena3Preco: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;

  const abre = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 110, mass: 0.9 } });
  const valor = interpolate(frame, [66, 104], [0, VALOR_SUGERIDO], {
    ...clamp,
    easing: Easing.bezier(...ease),
  });
  const letras = Math.round(interpolate(frame, [112, 150], [0, GANCHO.length], clamp));

  return (
    <AbsoluteFill style={{ background: backgrounds.light, overflow: "hidden" }}>
      {/* os outros leads descendo e desfocando */}
      {new Array(4).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: `${58 + i * 9}%`,
            translate: `-50% ${interpolate(abre, [0, 1], [0, 90 * unit * (i + 1)])}px`,
            width: 700 * unit,
            height: 56 * unit,
            borderRadius: 18 * unit,
            background: "#fff",
            opacity: interpolate(abre, [0, 1], [0.9, 0], clamp),
            filter: `blur(${interpolate(abre, [0, 1], [0, 6])}px)`,
          }}
        />
      ))}

      {/* card do lead aberto */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "47%",
          translate: "-50% -50%",
          width: 860 * unit,
          padding: 54 * unit,
          borderRadius: 40 * unit,
          background: "#fff",
          boxShadow: `0 ${26 * unit}px ${64 * unit}px rgba(6,20,44,.22)`,
          scale: interpolate(abre, [0, 1], [0.72, 1], clamp),
          opacity: interpolate(abre, [0, 0.2], [0, 1], clamp),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 * unit }}>
          <div
            style={{
              width: 60 * unit,
              height: 60 * unit,
              borderRadius: 16 * unit,
              background: "rgba(17,108,254,.12)",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ height: 18 * unit, width: "64%", borderRadius: 9 * unit, background: colors.navy3, opacity: 0.45 }} />
            <div style={{ height: 13 * unit, width: "38%", borderRadius: 7 * unit, background: colors.navy3, opacity: 0.22, marginTop: 10 * unit }} />
          </div>
          <Check unit={unit} size={40} />
        </div>

        <div style={{ height: 1, background: "rgba(6,20,44,.1)", margin: `${34 * unit}px 0` }} />

        <div style={{ fontFamily: fonts.kicker, fontSize: 24 * unit, letterSpacing: 5 * unit, color: colors.blue }}>
          VALOR SUGERIDO
        </div>
        <div
          style={{
            fontFamily: fonts.title,
            fontWeight: 700,
            fontSize: 118 * unit,
            letterSpacing: -3 * unit,
            color: colors.navy,
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {brl(valor)}
        </div>

        <div
          style={{
            marginTop: 26 * unit,
            padding: `${20 * unit}px ${24 * unit}px`,
            borderRadius: 18 * unit,
            background: "rgba(17,108,254,.08)",
            fontFamily: fonts.body,
            fontSize: 30 * unit,
            color: colors.navy,
            minHeight: 76 * unit,
            opacity: interpolate(frame, [108, 118], [0, 1], clamp),
          }}
        >
          <span style={{ fontFamily: fonts.kicker, fontSize: 21 * unit, letterSpacing: 4 * unit, color: colors.blue }}>
            GANCHO{" "}
          </span>
          {GANCHO.slice(0, letras)}
          <span style={{ opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0, color: colors.blue }}>|</span>
        </div>
      </div>

      {/* porte, receita e valor sendo sugados para dentro do card */}
      {ORBITA.map(({ nome, de, t0 }) => {
        const p = interpolate(frame, [t0, t0 + 22], [0, 1], { ...clamp, easing: Easing.bezier(...ease) });
        // trajetoria em arco: o x chega antes do y, entao a curva entorta
        const x = interpolate(p, [0, 1], [de[0], 0]);
        const y = interpolate(Math.pow(p, 1.7), [0, 1], [de[1], 0]);
        return (
          <IconeBolha
            key={nome}
            nome={nome}
            unit={unit}
            style={{
              position: "absolute",
              left: "50%",
              top: "47%",
              translate: `calc(-50% + ${x * unit}px) calc(-50% + ${y * unit}px)`,
              scale: interpolate(p, [0, 0.72, 1], [1, 0.9, 0.2], clamp),
              opacity: interpolate(p, [0, 0.08, 0.78, 1], [0, 1, 1, 0], clamp),
            }}
          />
        );
      })}

      <Titulo
        unit={unit}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "13%",
          opacity: interpolate(frame, [16, 30], [0, 1], { ...clamp, easing: Easing.bezier(...ease) }),
        }}
      >
        Ela diz <span style={{ color: colors.blue }}>quanto cobrar</span>
      </Titulo>
    </AbsoluteFill>
  );
};
