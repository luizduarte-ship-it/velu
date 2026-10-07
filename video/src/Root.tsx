import { Composition } from "remotion";
import { ReelsPrimeiraVenda, reelsDefaults, reelsSchema } from "./velu/ReelsPrimeiraVenda";
import { VeluIntro, veluIntroDefaults, veluIntroSchema } from "./velu/VeluIntro";

// Cada <Composition> vira um video renderizavel (id = nome no render).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VeluIntro"
        component={VeluIntro}
        schema={veluIntroSchema}
        defaultProps={veluIntroDefaults}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="VeluIntroVertical"
        component={VeluIntro}
        schema={veluIntroSchema}
        defaultProps={veluIntroDefaults}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelsPrimeiraVenda"
        component={ReelsPrimeiraVenda}
        schema={reelsSchema}
        defaultProps={reelsDefaults}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
