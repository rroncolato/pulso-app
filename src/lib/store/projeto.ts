import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { Projeto, Mapa, Escuta, NomeSugerido, Leitura } from "@/types";

interface ProjetoState {
  projetos: Projeto[];
  projetoAtivo: Projeto | null;
  carregando: boolean;

  carregarProjetos: () => Promise<void>;
  criarProjeto: (titulo: string, tipologia: Projeto["tipologia"]) => Promise<Projeto>;
  deletarProjeto: (id: string) => Promise<void>;
  selecionarProjeto: (id: string) => void;
  salvarMapa: (mapa: Mapa) => Promise<void>;
  salvarEscuta: (escuta: Escuta) => Promise<void>;
  salvarConstelacao: (nomes: NomeSugerido[]) => Promise<void>;
  toggleFavorito: (nomeId: string) => void;
  definirFinalistas: (ids: string[]) => Promise<void>;
  adicionarLeitura: (leitura: Leitura) => Promise<void>;
}

async function syncSupabase(id: string, dados: Partial<Projeto>) {
  const supabase = createClient();
  await supabase
    .from("projetos")
    .update({ dados, atualizado_em: new Date().toISOString() })
    .eq("id", id);
}

export const useProjetoStore = create<ProjetoState>()((set, get) => ({
  projetos: [],
  projetoAtivo: null,
  carregando: false,

  carregarProjetos: async () => {
    set({ carregando: true });
    const supabase = createClient();
    const { data } = await supabase
      .from("projetos")
      .select("*")
      .order("atualizado_em", { ascending: false });

    if (data) {
      const projetos: Projeto[] = data.map((row) => ({
        id: row.id,
        titulo: row.titulo,
        tipologia: row.tipologia,
        status: row.status,
        criadoEm: row.criado_em,
        atualizadoEm: row.atualizado_em,
        ...row.dados,
      }));
      set({ projetos, carregando: false });
    } else {
      set({ carregando: false });
    }
  },

  criarProjeto: async (titulo, tipologia) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autenticado");

    const { data, error } = await supabase
      .from("projetos")
      .insert({
        user_id: user.id,
        titulo,
        tipologia,
        status: "rascunho",
        dados: {},
      })
      .select()
      .single();

    if (error || !data) throw new Error("Erro ao criar projeto");

    const novo: Projeto = {
      id: data.id,
      titulo: data.titulo,
      tipologia: data.tipologia,
      status: data.status,
      criadoEm: data.criado_em,
      atualizadoEm: data.atualizado_em,
    };

    set((s) => ({ projetos: [novo, ...s.projetos], projetoAtivo: novo }));
    return novo;
  },

  deletarProjeto: async (id) => {
    const supabase = createClient();
    await supabase.from("projetos").delete().eq("id", id);
    set((s) => ({
      projetos: s.projetos.filter((p) => p.id !== id),
      projetoAtivo: s.projetoAtivo?.id === id ? null : s.projetoAtivo,
    }));
  },

  selecionarProjeto: (id) => {
    const p = get().projetos.find((p) => p.id === id) ?? null;
    set({ projetoAtivo: p });
  },

  salvarMapa: async (mapa) => {
    const { projetoAtivo } = get();
    if (!projetoAtivo) return;
    const atualizado = { ...projetoAtivo, mapa, status: "em_andamento" as const, atualizadoEm: new Date().toISOString() };
    set((s) => ({
      projetoAtivo: atualizado,
      projetos: s.projetos.map((p) => p.id === atualizado.id ? atualizado : p),
    }));
    await syncSupabase(projetoAtivo.id, { mapa, status: "em_andamento" });
  },

  salvarEscuta: async (escuta) => {
    const { projetoAtivo } = get();
    if (!projetoAtivo) return;
    const atualizado = { ...projetoAtivo, escuta, atualizadoEm: new Date().toISOString() };
    set((s) => ({
      projetoAtivo: atualizado,
      projetos: s.projetos.map((p) => p.id === atualizado.id ? atualizado : p),
    }));
    await syncSupabase(projetoAtivo.id, { escuta });
  },

  salvarConstelacao: async (nomes) => {
    const { projetoAtivo } = get();
    if (!projetoAtivo) return;
    const atualizado = { ...projetoAtivo, constelacao: nomes, atualizadoEm: new Date().toISOString() };
    set((s) => ({
      projetoAtivo: atualizado,
      projetos: s.projetos.map((p) => p.id === atualizado.id ? atualizado : p),
    }));
    await syncSupabase(projetoAtivo.id, { constelacao: nomes });
  },

  toggleFavorito: (nomeId) => {
    const { projetoAtivo } = get();
    if (!projetoAtivo?.constelacao) return;
    const constelacao = projetoAtivo.constelacao.map((n) =>
      n.id === nomeId ? { ...n, favorito: !n.favorito } : n
    );
    const atualizado = { ...projetoAtivo, constelacao };
    set((s) => ({
      projetoAtivo: atualizado,
      projetos: s.projetos.map((p) => p.id === atualizado.id ? atualizado : p),
    }));
    syncSupabase(projetoAtivo.id, { constelacao });
  },

  definirFinalistas: async (ids) => {
    const { projetoAtivo } = get();
    if (!projetoAtivo?.constelacao) return;
    const finalistas = projetoAtivo.constelacao.filter((n) => ids.includes(n.id));
    const atualizado = { ...projetoAtivo, finalistas, atualizadoEm: new Date().toISOString() };
    set((s) => ({
      projetoAtivo: atualizado,
      projetos: s.projetos.map((p) => p.id === atualizado.id ? atualizado : p),
    }));
    await syncSupabase(projetoAtivo.id, { finalistas });
  },

  adicionarLeitura: async (leitura) => {
    const { projetoAtivo } = get();
    if (!projetoAtivo) return;
    const leituras = [...(projetoAtivo.leituras ?? []).filter((l) => l.nomeAvaliado !== leitura.nomeAvaliado), leitura];
    const atualizado = { ...projetoAtivo, leituras, status: "finalizado" as const, atualizadoEm: new Date().toISOString() };
    set((s) => ({
      projetoAtivo: atualizado,
      projetos: s.projetos.map((p) => p.id === atualizado.id ? atualizado : p),
    }));
    await syncSupabase(projetoAtivo.id, { leituras, status: "finalizado" });
  },
}));
