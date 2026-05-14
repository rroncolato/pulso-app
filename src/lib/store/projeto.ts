import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Projeto, Mapa, Escuta, NomeSugerido, Leitura } from "@/types";

interface ProjetoState {
  projetos: Projeto[];
  projetoAtivo: Projeto | null;

  criarProjeto: (titulo: string, tipologia: Projeto["tipologia"]) => Projeto;
  deletarProjeto: (id: string) => void;
  selecionarProjeto: (id: string) => void;
  salvarMapa: (mapa: Mapa) => void;
  salvarEscuta: (escuta: Escuta) => void;
  salvarConstelacao: (nomes: NomeSugerido[]) => void;
  toggleFavorito: (nomeId: string) => void;
  definirFinalistas: (ids: string[]) => void;
  adicionarLeitura: (leitura: Leitura) => void;
}

export const useProjetoStore = create<ProjetoState>()(
  persist(
    (set, get) => ({
      projetos: [],
      projetoAtivo: null,

      criarProjeto: (titulo, tipologia) => {
        const novo: Projeto = {
          id: crypto.randomUUID(),
          titulo,
          tipologia,
          status: "rascunho",
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
        };
        set((s) => ({ projetos: [novo, ...s.projetos], projetoAtivo: novo }));
        return novo;
      },

      deletarProjeto: (id) =>
        set((s) => ({
          projetos: s.projetos.filter((p) => p.id !== id),
          projetoAtivo: s.projetoAtivo?.id === id ? null : s.projetoAtivo,
        })),

      selecionarProjeto: (id) => {
        const p = get().projetos.find((p) => p.id === id) ?? null;
        set({ projetoAtivo: p });
      },

      salvarMapa: (mapa) =>
        set((s) => {
          if (!s.projetoAtivo) return s;
          const atualizado = { ...s.projetoAtivo, mapa, atualizadoEm: new Date().toISOString(), status: "em_andamento" as const };
          return {
            projetoAtivo: atualizado,
            projetos: s.projetos.map((p) => (p.id === atualizado.id ? atualizado : p)),
          };
        }),

      salvarEscuta: (escuta) =>
        set((s) => {
          if (!s.projetoAtivo) return s;
          const atualizado = { ...s.projetoAtivo, escuta, atualizadoEm: new Date().toISOString() };
          return {
            projetoAtivo: atualizado,
            projetos: s.projetos.map((p) => (p.id === atualizado.id ? atualizado : p)),
          };
        }),

      salvarConstelacao: (nomes) =>
        set((s) => {
          if (!s.projetoAtivo) return s;
          const atualizado = { ...s.projetoAtivo, constelacao: nomes, atualizadoEm: new Date().toISOString() };
          return {
            projetoAtivo: atualizado,
            projetos: s.projetos.map((p) => (p.id === atualizado.id ? atualizado : p)),
          };
        }),

      toggleFavorito: (nomeId) =>
        set((s) => {
          if (!s.projetoAtivo?.constelacao) return s;
          const constelacao = s.projetoAtivo.constelacao.map((n) =>
            n.id === nomeId ? { ...n, favorito: !n.favorito } : n
          );
          const atualizado = { ...s.projetoAtivo, constelacao };
          return {
            projetoAtivo: atualizado,
            projetos: s.projetos.map((p) => (p.id === atualizado.id ? atualizado : p)),
          };
        }),

      definirFinalistas: (ids) =>
        set((s) => {
          if (!s.projetoAtivo?.constelacao) return s;
          const finalistas = s.projetoAtivo.constelacao.filter((n) => ids.includes(n.id));
          const atualizado = { ...s.projetoAtivo, finalistas, atualizadoEm: new Date().toISOString() };
          return {
            projetoAtivo: atualizado,
            projetos: s.projetos.map((p) => (p.id === atualizado.id ? atualizado : p)),
          };
        }),

      adicionarLeitura: (leitura) =>
        set((s) => {
          if (!s.projetoAtivo) return s;
          const leituras = [...(s.projetoAtivo.leituras ?? [])];
          const idx = leituras.findIndex((l) => l.nomeAvaliado === leitura.nomeAvaliado);
          if (idx >= 0) leituras[idx] = leitura;
          else leituras.push(leitura);
          const atualizado = { ...s.projetoAtivo, leituras, atualizadoEm: new Date().toISOString() };
          return {
            projetoAtivo: atualizado,
            projetos: s.projetos.map((p) => (p.id === atualizado.id ? atualizado : p)),
          };
        }),
    }),
    { name: "pulso-projetos" }
  )
);
