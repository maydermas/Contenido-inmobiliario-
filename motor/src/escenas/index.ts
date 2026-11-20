import type React from "react";
import type { EscenaProps } from "../tipos";
import { CinematicIntro, CinematicScene, CTAEnding, DocumentReveal, EmotionalEnding, ParallaxScene } from "./cinematicas";
import { AnimatedNumber, ComparisonScene, FinancialChart, KineticTypography, MapScene } from "./graficos";
import { ArchitectureScene } from "./tres-d";

/**
 * Catálogo de escenas. El campo `escena.tipo` de cada bloque del guion apunta aquí.
 * (DynamicSubtitle y BrandSignature son capas globales: ver componentes/.)
 */
export const ESCENAS: Record<string, React.FC<EscenaProps<any>>> = {
  CinematicIntro,
  CinematicScene,
  ParallaxScene,
  KineticTypography,
  AnimatedNumber,
  FinancialChart,
  ComparisonScene,
  DocumentReveal,
  ArchitectureScene,
  MapScene,
  EmotionalEnding,
  CTAEnding,
};

export const TIPOS_ESCENA = Object.keys(ESCENAS);
