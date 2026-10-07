import { Composition } from "remotion";
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
    </>
  );
};
