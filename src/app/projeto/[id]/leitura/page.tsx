"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProjetoStore } from "@/lib/store/projeto";
import { OrbLoading } from "@/components/pulso/OrbLoading";
import type { Leitura } from "@/types";
import { BookOpen, ArrowRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const eixosNeumeier = [
  { key: "distinctiveness", label: "Distinção", desc: "Se diferencia dos concorrentes" },
  { key: "brevity", label: "Brevidade", desc: "Curto, resistente a apelidos" },
  { key: "appropriateness", label: "Adequação", desc: "Conectado ao propósito" },
  { key: "spelling", label: "Fluência", desc: "Fácil de escrever e pronunciar" },
  { key: "likability", label: "Simpatia", desc: "Agrada o ouvido" },
  { key: "extendability", label: "Extensão", desc: "Rende em peças e narrativa" },
  { key: "protectability", label: "Proteção", desc: "Registrável e disponível" },
] as const;

const dimensoesIgor = [
  { key: "appearance", label: "Visual" },
  { key: "distinctive", label: "Distinção" },
  { key: "depth", label: "Profundidade" },
  { key: "energy", label: "Energia" },
  { key: "humanity", label: "Humanidade" },
  { key: "positioning", label: "Posição" },
  { key: "sound", label: "Som" },
  { key: "magic", label: "Magnetismo" },
  { key: "trademark", label: "Marca" },
] as const;

export default function LeituraPage() {
  const params = useParams();
  const router = useRouter();
  const { projetoAtivo, adicionarLeitura } = useProjetoStore();
  const [nomeSelecionado, setNomeSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [leituraAtual, setLeituraAtual] = useState<Leitura | null>(null);
  const [erro, setErro] = useState("");

  const finalistas = projetoAtivo?.finalistas ?? [];
  const leituras = projetoAtivo?.leituras ?? [];

  async function lerNome(nome: string) {
    if (!projetoAtivo?.mapa) return;
    setNomeSelecionado(nome);
    setLoading(true);
    setErro("");
    setLeituraAtual(null);

    const existente = leituras.find((l) => l.nomeAvaliado === nome);
    if (existente) {
      setLeituraAtual(existente);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/eco/avaliar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, mapa: projetoAtivo.mapa }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const leitura: Leitura = { nomeAvaliado: nome, ...data };
      adicionarLeitura(leitura);
      setLeituraAtual(leitura);
    } catch {
      setErro("Eco não conseguiu completar a leitura. O nome continua salvo no Caderno — tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-background" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Fase 4</p>
          <h1 className="text-xl font-semibold leading-none">Leitura</h1>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-8 ml-11">
        Ler um nome é decifrá-lo em camadas — som, sentido, mercado, futuro.
      </p>

      <div className="flex gap-2 flex-wrap mb-8">
        {finalistas.map((n) => {
          const lido = leituras.some((l) => l.nomeAvaliado === n.nome);
          return (
            <button
              key={n.id}
              onClick={() => lerNome(n.nome)}
              className={cn(
                "px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150",
                nomeSelecionado === n.nome
                  ? "bg-primary text-background border-primary"
                  : lido
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              {lido && nomeSelecionado !== n.nome && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />}
              {n.nome}
            </button>
          );
        })}
      </div>

      {loading && <OrbLoading />}

      {erro && <p className="text-sm text-destructive mb-6">{erro}</p>}

      {leituraAtual && !loading && (
        <div className="space-y-8">
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <p className="text-xs font-semibold mb-2 text-primary uppercase tracking-widest">Eco diz</p>
            <p className="text-base leading-relaxed text-foreground">{leituraAtual.recomendacao}</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center bg-card border border-border rounded-2xl p-8 inline-block">
              <p className="text-5xl font-bold text-primary leading-none">{leituraAtual.scoreTotal}</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Pulsação geral</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Eixos Neumeier</h3>
            <div className="space-y-3">
              {eixosNeumeier.map(({ key, label, desc }) => {
                const val = leituraAtual.neumeier[key];
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{label} <span className="text-muted-foreground font-normal text-xs">— {desc}</span></span>
                      <span className="font-semibold tabular-nums">{val}/10</span>
                    </div>
                    <Progress value={val * 10} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Dimensões Igor</h3>
            <div className="grid grid-cols-3 gap-3">
              {dimensoesIgor.map(({ key, label }) => {
                const val = leituraAtual.igor[key];
                return (
                  <div key={key} className="bg-card border border-border rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{val}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Lentes nominativas</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["registro", "ruido", "espelho"] as const).map((lente) => {
                const { aprovado, notas } = leituraAtual.lentes[lente];
                const Icon = aprovado ? CheckCircle2 : lente === "espelho" ? AlertCircle : XCircle;
                const labels = { registro: "Registro", ruido: "Ruído", espelho: "Espelho" };
                return (
                  <div key={lente} className={cn(
                    "rounded-xl p-4 border bg-card",
                    aprovado ? "border-emerald-500/30 bg-emerald-950/20" : "border-amber-500/30 bg-amber-950/20"
                  )}>
                    <Icon className={cn("w-5 h-5 mb-2", aprovado ? "text-emerald-400" : "text-amber-400")} />
                    <p className="text-sm font-medium mb-1 text-foreground">{labels[lente]}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{notas || (aprovado ? "Sem interferências." : "Atenção necessária.")}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {leituras.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border">
          <Button onClick={() => router.push(`/projeto/${params.id}/passaporte`)} className="w-full gap-2" size="lg">
            Gerar Passaporte
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
