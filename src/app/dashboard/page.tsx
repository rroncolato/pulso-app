"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Clock, CheckCircle2, Circle,
  ArrowRight, Zap, BookOpen, Sparkles, TrendingUp, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjetoStore } from "@/lib/store/projeto";
import { NovoProjeto } from "@/components/pulso/NovoProjeto";
import { ConfirmarDelecao } from "@/components/pulso/ConfirmarDelecao";
import type { Projeto } from "@/types";
import { cn } from "@/lib/utils";

const labelTipologia: Record<Projeto["tipologia"], string> = {
  corporativo: "Corporativo",
  produto: "Produto",
  servico: "Serviço",
  personagem: "Personagem",
};

const statusConfig: Record<Projeto["status"], { label: string; icon: typeof Circle; cor: string }> = {
  rascunho:     { label: "Rascunho",     icon: Circle,       cor: "text-muted-foreground" },
  em_andamento: { label: "Em andamento", icon: Clock,        cor: "text-primary" },
  finalizado:   { label: "Finalizado",   icon: CheckCircle2, cor: "text-emerald-400" },
};

const fasesLabel = ["Mapa", "Escuta", "Invenção", "Leitura", "Passaporte"];
const fasesKey = ["mapa", "escuta", "constelacao", "leituras", "leituras"];

function progresso(p: Projeto): number {
  const proj = p as unknown as Record<string, unknown>;
  const concluidas = fasesKey.filter((k) => !!proj[k]).length;
  return Math.round((concluidas / fasesKey.length) * 100);
}

export default function DashboardPage() {
  const { projetos, selecionarProjeto, deletarProjeto } = useProjetoStore();
  const [modalAberto, setModalAberto] = useState(false);
  const [deletando, setDeletando] = useState<{ id: string; titulo: string } | null>(null);
  const router = useRouter();

  function abrirProjeto(id: string) {
    selecionarProjeto(id);
    router.push(`/projeto/${id}/mapa`);
  }

  const total = projetos.length;
  const emAndamento = projetos.filter((p) => p.status === "em_andamento").length;
  const finalizados = projetos.filter((p) => p.status === "finalizado").length;
  const totalNomes = projetos.reduce((acc, p) => acc + (p.finalistas?.length ?? 0), 0);

  return (
    <div className="flex min-h-screen">
      {/* ── Centro — lista de projetos ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Caderno</p>
            <h1 className="text-xl font-bold leading-none">Seus projetos</h1>
          </div>
          <Button onClick={() => setModalAberto(true)} className="gap-2 font-semibold">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Novo projeto
          </Button>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px border-b border-border bg-border shrink-0">
          {[
            { label: "Total", value: total, icon: BookOpen },
            { label: "Em andamento", value: emAndamento, icon: Clock },
            { label: "Finalizados", value: finalizados, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card px-8 py-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Projetos */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {projetos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-64 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-lg mb-1">O caderno está em branco.</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Comece pelo que a marca sente, não pelo que ela faz.
              </p>
              <Button onClick={() => setModalAberto(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar primeiro projeto
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {projetos.map((projeto) => {
                const status = statusConfig[projeto.status];
                const StatusIcon = status.icon;
                const pct = progresso(projeto);

                return (
                  <div
                    key={projeto.id}
                    onClick={() => abrirProjeto(projeto.id)}
                    className="group cursor-pointer bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:bg-card/80 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Indicador de tipo */}
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-semibold text-base leading-tight">{projeto.titulo}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                                {labelTipologia[projeto.tipologia]}
                              </Badge>
                              <span className={cn("flex items-center gap-1 text-[11px]", status.cor)}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {new Date(projeto.atualizadoEm).toLocaleDateString("pt-BR")}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletando({ id: projeto.id, titulo: projeto.titulo });
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                          </div>
                        </div>

                        {/* Barra de progresso das fases */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 flex-1">
                            {fasesLabel.map((fase, idx) => {
                              const proj = projeto as unknown as Record<string, unknown>;
                              const concluida = !!(fasesKey[idx] && proj[fasesKey[idx]]);
                              return (
                                <div key={fase} className="flex-1">
                                  <div className={cn(
                                    "h-1 rounded-full transition-all duration-300",
                                    concluida ? "bg-primary" : "bg-muted"
                                  )} />
                                  <p className="text-[9px] text-muted-foreground mt-1 truncate">{fase}</p>
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground w-8 text-right shrink-0">
                            {pct}%
                          </span>
                        </div>

                        {/* Finalistas */}
                        {projeto.finalistas && projeto.finalistas.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap mt-3 pt-3 border-t border-border">
                            {projeto.finalistas.slice(0, 4).map((n) => (
                              <span
                                key={n.id}
                                className="text-[11px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold"
                              >
                                {n.nome}
                              </span>
                            ))}
                            {projeto.finalistas.length > 4 && (
                              <span className="text-[11px] text-muted-foreground px-2 py-0.5">
                                +{projeto.finalistas.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Direita — painel de inteligência ── */}
      <aside className="w-72 border-l border-border flex flex-col shrink-0 bg-card">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Inteligência</p>
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {/* Métrica de nomes */}
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Visão geral</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Projetos", value: total },
                { label: "Finalistas", value: totalNomes },
                { label: "Andamento", value: emAndamento },
                { label: "Concluídos", value: finalizados },
              ].map(({ label, value }) => (
                <div key={label} className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-xl font-bold leading-none">{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Método */}
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Método ativo</p>
            </div>
            <p className="text-sm font-semibold mb-1">Nammy · TheUglyLab</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Escuta · Invenção · Leitura · Passaporte. Neumeier + Igor como eixos de avaliação.
            </p>
          </div>

          {/* Eco */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">Eco ativa</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A Eco pensa antes de batizar. Ela gera, avalia e fundamenta — você decide.
            </p>
          </div>

          {/* Atalho */}
          <button
            onClick={() => setModalAberto(true)}
            className="w-full text-left bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/30 hover:bg-muted transition-all duration-150 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Novo projeto</p>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Comece pelo que a marca sente.
            </p>
          </button>
        </div>
      </aside>

      <NovoProjeto aberto={modalAberto} onFechar={() => setModalAberto(false)} />
      <ConfirmarDelecao
        aberto={!!deletando}
        titulo={deletando?.titulo ?? ""}
        onConfirmar={() => {
          if (deletando) deletarProjeto(deletando.id);
          setDeletando(null);
        }}
        onCancelar={() => setDeletando(null)}
      />
    </div>
  );
}
