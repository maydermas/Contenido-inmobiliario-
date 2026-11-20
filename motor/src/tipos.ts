export type Palabra = { t: string; s: number; e: number };

export type BloqueTiming = { id: string; start: number; end: number; palabras: Palabra[] };

export type Escena = { tipo: string; props: Record<string, any> };

export type Bloque = {
  id: string;
  voz: string;
  destacar?: string[];
  escena: Escena;
};

export type VideoData = {
  id: string;
  titulo: string;
  estilo: string;
  bloques: Bloque[];
  timing: { duracionVoz: number; bloques: BloqueTiming[] };
  assets: { voz: string; musica: string };
};

/** Lo que recibe cada escena */
export type EscenaProps<P = Record<string, any>> = {
  /** duración de la escena en frames */
  dur: number;
  /** frame (relativo al inicio de la escena) en que se pronuncia una palabra del bloque */
  marca: (palabra: string, porDefecto?: number) => number;
  props: P;
};
