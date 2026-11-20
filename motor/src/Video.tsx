import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, VIDEO } from "./marca/tokens";
import { entra, normalizar } from "./lib/anim";
import { ESCENAS } from "./escenas";
import { Acabado, Sonido } from "./componentes/base";
import { DynamicSubtitle } from "./componentes/DynamicSubtitle";
import { MarcaAgua } from "./componentes/BrandSignature";
import type { VideoData } from "./tipos";

export const duracionFrames = (d: VideoData) => Math.ceil((d.timing.duracionVoz + VIDEO.cola) * VIDEO.fps);

/** Calcula en qué frame empieza y acaba cada escena a partir de los tiempos de la voz */
export const tramos = (d: VideoData) => {
  const total = duracionFrames(d);
  const inicios = d.timing.bloques.map((b, i) => (i === 0 ? 0 : Math.max(0, Math.round(b.start * VIDEO.fps) - VIDEO.adelanto)));
  return inicios.map((s, i) => ({ desde: s, hasta: i + 1 < inicios.length ? inicios[i + 1] : total }));
};

const Transicion: React.FC<{ primera: boolean; children: React.ReactNode }> = ({ primera, children }) => {
  const frame = useCurrentFrame();
  if (primera) return <>{children}</>;
  const p = entra(frame, 0, VIDEO.transicion);
  return (
    <AbsoluteFill style={{ opacity: p, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, transform: `scale(${1.03 - 0.03 * p})` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ data: VideoData }> = ({ data }) => {
  const { fps } = useVideoConfig();
  const t = useMemo(() => tramos(data), [data]);
  const total = duracionFrames(data);

  // Música con atenuación automática mientras habla la voz (ducking)
  const volumenMusica = useMemo(() => {
    const habla = new Float32Array(total);
    data.timing.bloques.forEach((b) =>
      b.palabras.forEach((p) => {
        for (let f = Math.floor((p.s - 0.15) * fps); f <= Math.ceil((p.e + 0.35) * fps); f++) if (f >= 0 && f < total) habla[f] = 1;
      }),
    );
    const v = new Float32Array(total);
    const R = 8;
    for (let f = 0; f < total; f++) {
      let s = 0, n = 0;
      for (let k = -R; k <= R; k++) if (f + k >= 0 && f + k < total) { s += habla[f + k]; n++; }
      v[f] = 0.3 - 0.15 * (s / n);
    }
    return v;
  }, [data, fps, total]);

  return (
    <AbsoluteFill style={{ background: C.verde }}>
      {data.bloques.map((b, i) => {
        const Comp = ESCENAS[b.escena.tipo];
        const { desde, hasta } = t[i];
        const dur = hasta - desde;
        const inicioSeg = desde / fps;
        const tiempos = new Map<string, number>();
        data.timing.bloques[i].palabras.forEach((p) => {
          const k = normalizar(p.t);
          if (!tiempos.has(k)) tiempos.set(k, p.s);
        });
        const marca = (palabra: string, porDefecto = -1) => {
          const s = tiempos.get(normalizar(palabra));
          return s === undefined ? porDefecto : Math.round((s - inicioSeg) * fps);
        };
        return (
          <Sequence key={b.id} from={desde} durationInFrames={dur + (i + 1 < data.bloques.length ? VIDEO.transicion : 0)} name={`${i + 1}. ${b.id} · ${b.escena.tipo}`}>
            <Transicion primera={i === 0}>
              <Comp dur={dur} marca={marca} props={b.escena.props} />
            </Transicion>
            {i > 0 && <Sonido en={0} src="whoosh" volumen={0.12} />}
          </Sequence>
        );
      })}

      <Audio src={staticFile(data.assets.voz)} />
      <Audio src={staticFile(data.assets.musica)} volume={(f) => volumenMusica[Math.min(f, total - 1)] ?? 0.2} />

      <DynamicSubtitle
        bloques={data.timing.bloques}
        destacar={data.bloques.map((b) => b.destacar ?? [])}
        tonos={data.bloques.map((b) => (b.escena.props?.tono === "claro" ? "claro" : "oscuro"))}
      />
      <Sequence from={0} durationInFrames={t[t.length - 1].desde}>
        <MarcaAgua />
      </Sequence>
      <Acabado />
    </AbsoluteFill>
  );
};
