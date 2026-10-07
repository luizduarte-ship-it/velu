import type React from "react";
import { colors, fonts } from "../brand";

// Pseudo aleatorio deterministico. Math.random() nao serve: o Remotion
// renderiza frame a frame, as vezes em processos paralelos, e cada frame
// sortearia um valor diferente. Isso aqui sempre devolve o mesmo para o
// mesmo par (i, seed).
export const rnd = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const ease = [0.16, 1, 0.3, 1] as const;
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// ---------------------------------------------------------------- silhueta

type SilhuetaProps = {
  readonly unit: number;
  readonly postura: "caida" | "ereta";
  readonly cor?: string;
  readonly style?: React.CSSProperties;
};

// Pessoa em silhueta, desenhada em codigo. "caida" = ombros baixos e cabeca
// pra frente; "ereta" = ombro no lugar. E a mesma pessoa nas cenas 1 e 5.
export const Silhueta: React.FC<SilhuetaProps> = ({
  unit,
  postura,
  cor = colors.navy,
  style,
}) => {
  const caida = postura === "caida";
  return (
    <svg
      viewBox="0 0 200 260"
      width={200 * unit}
      height={260 * unit}
      style={{ display: "block", ...style }}
    >
      <circle cx={100} cy={caida ? 62 : 54} r={38} fill={cor} />
      <path
        d={
          caida
            ? "M100 108 C52 108, 26 142, 20 208 L20 260 L180 260 L180 208 C174 142, 148 108, 100 108 Z"
            : "M100 100 C46 100, 18 136, 12 206 L12 260 L188 260 L188 206 C182 136, 154 100, 100 100 Z"
        }
        fill={cor}
      />
    </svg>
  );
};

// ---------------------------------------------------------------- textos

type TituloProps = {
  readonly unit: number;
  readonly kicker?: string;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
};

export const Titulo: React.FC<TituloProps> = ({
  unit,
  kicker,
  children,
  style,
}) => (
  <div style={{ textAlign: "center", ...style }}>
    {kicker ? (
      <div
        style={{
          fontFamily: fonts.kicker,
          fontSize: 26 * unit,
          letterSpacing: 6 * unit,
          color: colors.blue,
          marginBottom: 16 * unit,
        }}
      >
        {kicker}
      </div>
    ) : null}
    <div
      style={{
        fontFamily: fonts.title,
        fontWeight: 700,
        fontSize: 76 * unit,
        lineHeight: 1.04,
        letterSpacing: -2 * unit,
        color: colors.navy,
      }}
    >
      {children}
    </div>
  </div>
);

// ---------------------------------------------------------------- pecas de ui

// Card generico de empresa: so barrinhas, nunca nome real.
export const CardEmpresa: React.FC<{
  readonly unit: number;
  readonly style?: React.CSSProperties;
}> = ({ unit, style }) => (
  <div
    style={{
      width: 230 * unit,
      padding: 20 * unit,
      borderRadius: 18 * unit,
      background: "#fff",
      boxShadow: `0 ${14 * unit}px ${34 * unit}px rgba(6,20,44,.16)`,
      display: "flex",
      flexDirection: "column",
      gap: 12 * unit,
      ...style,
    }}
  >
    <div
      style={{
        height: 14 * unit,
        width: "72%",
        borderRadius: 7 * unit,
        background: colors.navy3,
        opacity: 0.5,
      }}
    />
    <div
      style={{
        height: 11 * unit,
        width: "46%",
        borderRadius: 6 * unit,
        background: colors.navy3,
        opacity: 0.26,
      }}
    />
  </div>
);

export const Chip: React.FC<{
  readonly unit: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ unit, children, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12 * unit,
      padding: `${16 * unit}px ${28 * unit}px`,
      borderRadius: 999,
      background: "#fff",
      boxShadow: `0 ${12 * unit}px ${30 * unit}px rgba(6,20,44,.18)`,
      fontFamily: fonts.title,
      fontWeight: 700,
      fontSize: 32 * unit,
      color: colors.navy,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Check: React.FC<{
  readonly unit: number;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ unit, size = 34, style }) => (
  <svg
    viewBox="0 0 24 24"
    width={size * unit}
    height={size * unit}
    style={{ display: "block", ...style }}
  >
    <circle cx={12} cy={12} r={11} fill={colors.blue} />
    <path
      d="M7 12.4l3.2 3.2L17 9"
      fill="none"
      stroke="#fff"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------- icones

const PATHS = {
  predio:
    "M4 21V5a1 1 0 011-1h7a1 1 0 011 1v16M13 21V10h6a1 1 0 011 1v10M7 8h3M7 12h3M7 16h3M16 14h1M16 18h1",
  grafico: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  moeda:
    "M12 2v20M16.5 6.5c-.8-1-2.3-1.6-4.5-1.6-2.8 0-4.5 1.2-4.5 3s1.6 2.6 4.5 3.2c2.9.6 4.5 1.4 4.5 3.2s-1.7 3-4.5 3c-2.2 0-3.7-.6-4.5-1.6",
  celular:
    "M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1zM10 19h4",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  envelope: "M3 6h18v12H3zM3 7l9 6 9-6",
} as const;

export type IconeNome = keyof typeof PATHS;

export const Icone: React.FC<{
  readonly nome: IconeNome;
  readonly unit: number;
  readonly size?: number;
  readonly cor?: string;
  readonly style?: React.CSSProperties;
}> = ({ nome, unit, size = 52, cor = colors.blue, style }) => (
  <svg
    viewBox="0 0 24 24"
    width={size * unit}
    height={size * unit}
    fill="none"
    stroke={cor}
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", ...style }}
  >
    <path d={PATHS[nome]} />
  </svg>
);

// Icone dentro de uma bolha branca, do jeito que aparece orbitando o card.
export const IconeBolha: React.FC<{
  readonly nome: IconeNome;
  readonly unit: number;
  readonly style?: React.CSSProperties;
}> = ({ nome, unit, style }) => (
  <div
    style={{
      width: 104 * unit,
      height: 104 * unit,
      borderRadius: "50%",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 ${14 * unit}px ${34 * unit}px rgba(6,20,44,.2)`,
      ...style,
    }}
  >
    <Icone nome={nome} unit={unit} size={50} />
  </div>
);

// ---------------------------------------------------------------- formato

export const brl = (v: number) =>
  `R$ ${Math.round(v).toLocaleString("pt-BR")}`;
