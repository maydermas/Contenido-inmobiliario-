import React from "react";
import { Composition, Folder } from "remotion";
import { VIDEO } from "./marca/tokens";
import { Video, duracionFrames } from "./Video";
import { VIDEOS } from "./generado";
import { Muestrario } from "./Muestrario";
import { FotoPerfil } from "./FotoPerfil";

/** Una composición por cada vídeo preparado con `npm run producir -- <carpeta>` */
export const Root: React.FC = () => (
  <>
    <Folder name="videos">
      {VIDEOS.map((d) => (
        <Composition
          key={d.id}
          id={d.id}
          component={Video}
          defaultProps={{ data: d }}
          durationInFrames={duracionFrames(d)}
          fps={VIDEO.fps}
          width={VIDEO.ancho}
          height={VIDEO.alto}
        />
      ))}
    </Folder>
    <Folder name="identidad">
      <Composition id="Muestrario" component={Muestrario} durationInFrames={90} fps={VIDEO.fps} width={VIDEO.ancho} height={VIDEO.alto} />
      <Composition id="FotoPerfil" component={FotoPerfil} defaultProps={{ variante: "arco" as const }} durationInFrames={1} fps={VIDEO.fps} width={1080} height={1080} />
    </Folder>
  </>
);
