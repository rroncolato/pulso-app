export type TipologiaNaming = "corporativo" | "produto" | "servico" | "personagem";

export type StatusProjeto = "rascunho" | "em_andamento" | "finalizado";

export type EixoAvaliacao =
  | "distinctiveness"
  | "brevity"
  | "appropriateness"
  | "spelling"
  | "likability"
  | "extendability"
  | "protectability";

export type DimensaoIgor =
  | "appearance"
  | "distinctive"
  | "depth"
  | "energy"
  | "humanity"
  | "positioning"
  | "sound"
  | "magic"
  | "trademark";

export interface Mapa {
  nomeCliente: string;
  segmento: string;
  tipologia: TipologiaNaming;
  proposta: string;
  publicoAlvo: string;
  concorrentes: string;
  palavrasProibidas: string;
  personalidade: string;
  referencias: string;
}

export interface Escuta {
  territorioConceitual: string[];
  diferenciais: string;
  universoSemantico: string;
  vetoresEstrategicos: string[];
}

export interface NomeSugerido {
  id: string;
  nome: string;
  categoria: string;
  recursoLinguistico: string;
  justificativa: string;
  selecionado: boolean;
  favorito: boolean;
}

export interface AvaliacaoNeumeier {
  distinctiveness: number;
  brevity: number;
  appropriateness: number;
  spelling: number;
  likability: number;
  extendability: number;
  protectability: number;
  notas?: string;
}

export interface AvaliacaoIgor {
  appearance: number;
  distinctive: number;
  depth: number;
  energy: number;
  humanity: number;
  positioning: number;
  sound: number;
  magic: number;
  trademark: number;
}

export interface LentesNominativas {
  registro: { aprovado: boolean; notas: string };
  ruido: { aprovado: boolean; notas: string };
  espelho: { aprovado: boolean; notas: string };
}

export interface Leitura {
  nomeAvaliado: string;
  neumeier: AvaliacaoNeumeier;
  igor: AvaliacaoIgor;
  lentes: LentesNominativas;
  scoreTotal: number;
  recomendacao: string;
}

export interface Projeto {
  id: string;
  titulo: string;
  status: StatusProjeto;
  tipologia: TipologiaNaming;
  criadoEm: string;
  atualizadoEm: string;
  mapa?: Mapa;
  escuta?: Escuta;
  constelacao?: NomeSugerido[];
  finalistas?: NomeSugerido[];
  leituras?: Leitura[];
}
