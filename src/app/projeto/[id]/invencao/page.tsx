"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjetoStore } from "@/lib/store/projeto";
import { OrbLoading } from "@/components/pulso/OrbLoading";
import type { NomeSugerido } from "@/types";
import { Sparkles, ArrowRight, Star, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvencaoPage() {
  const params = useParams();
  const router = useRouter();
  const { projetoAtivo, salvarConstelacao, toggleFavorito, definirFinalistas } = useProjetoStore();

  const [loading, setLoading] = useState(false);
  const [nomes, setNomes] = useState<NomeSugerido[]>(projetoAtivo?.constelacao ?? []);
  const [erro, setErro] = useState("");

  async function gerarConstelacao() {
    if (!projetoAtivo?.mapa || !projetoAtivo?.escuta) return;
    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/eco/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapa: projetoAtivo.mapa, escuta: projetoAtivo.escuta }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const msg = data.error ?? "Erro desconhecido";
        if (msg.includes("ANTHROPIC_API_KEY")) {
          setErro("A chave da API não está configurada. Adicione a ANTHROPIC_API_KEY no arquivo .env.local e reinicie o servidor.");
        } else {
          setErro(`Eco não conseguiu completar a leitura. Detalhes: ${msg}`);
        }
        return;
      }

      const novos: NomeSugerido[] = (data.nomes ?? []).map(
        (n: Omit<NomeSugerido, "id" | "selecionado" | "favorito">) => ({
          ...n,
          id: crypto.randomUUID(),
          selecionado: false,
          favorito: false,
        })
      );

      if (novos.length === 0) {
        setErro("Eco retornou uma lista vazia. Tente novamente.");
        return;
      }

      setNomes(novos);
      salvarConstelacao(novos);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro de conexão";
      setErro(`Não foi possível conectar à Eco. ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  function toggleFavoritoLocal(id: string) {
    setNomes((prev) => prev.map((n) => (n.id === id ? { ...n, favorito: !n.favorito } : n)));
    toggleFavorito(id);
  }

  function avancarComFinalistas() {
    const favoritos = nomes.filter((n) => n.favorito).map((n) => n.id);
    definirFinalistas(favoritos.length > 0 ? favoritos : nomes.slice(0, 5).map((n) => n.id));
    router.push(`/projeto/${params.id}/leitura`);
  }

  const favoritos = nomes.filter((n) => n.favorito);

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-pulso-yellow/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Fase 3</p>
          <h1 className="text-xl font-semibold leading-none">Invenção</h1>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-8 ml-11">
        Inventando possibilidades. Marque com estrela os que respiram.
      </p>

      {loading ? (
        <OrbLoading />
      ) : nomes.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-medium mb-1">A constelação ainda não foi solta.</p>
          <p className="text-sm text-muted-foreground mb-6">
            Eco vai inventar 20 nomes a partir do Mapa e da Escuta.
          </p>
          {!projetoAtivo?.mapa && (
            <p className="text-xs text-amber-500 mb-4">Preencha o Mapa antes de gerar.</p>
          )}
          <Button onClick={gerarConstelacao} disabled={loading || !projetoAtivo?.mapa} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Inventando possibilidades..." : "Soltar a constelação"}
          </Button>
          {erro && <p className="text-xs text-destructive mt-4">{erro}</p>}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {nomes.length} nomes · {favoritos.length} marcados como finalistas
            </p>
            <Button variant="outline" size="sm" onClick={gerarConstelacao} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              Gerar novamente
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {nomes.map((nome) => (
              <div
                key={nome.id}
                className={cn(
                  "border rounded-2xl p-5 transition-all duration-200 cursor-pointer",
                  nome.favorito
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/50"
                    : "border-border hover:border-primary/30 hover:bg-card/50 bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg leading-tight text-foreground">
                      {nome.nome}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavoritoLocal(nome.id)}
                    className={cn(
                      "shrink-0 p-2 rounded-lg transition-all",
                      nome.favorito
                        ? "text-primary bg-primary/20"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <Star className={cn("w-5 h-5", nome.favorito && "fill-current")} />
                  </button>
                </div>

                <div className="flex gap-1.5 flex-wrap mb-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] px-2 py-0.5",
                      nome.favorito && "bg-primary/20 text-primary border-primary/30"
                    )}
                  >
                    {nome.categoria}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] px-2 py-0.5",
                      nome.favorito && "bg-primary/20 text-primary border-primary/30"
                    )}
                  >
                    {nome.recursoLinguistico}
                  </Badge>
                </div>

                <p className={cn("text-[13px] leading-relaxed", nome.favorito ? "text-foreground/80" : "text-muted-foreground")}>
                  {nome.justificativa}
                </p>
              </div>
            ))}
          </div>

          <div className="sticky bottom-6">
            <Button
              onClick={avancarComFinalistas}
              className="w-full gap-2 shadow-lg"
              size="lg"
              disabled={favoritos.length === 0}
            >
              Avançar para a Leitura
              {favoritos.length > 0 && (
                <Badge variant="secondary" className="bg-background/20 text-background ml-1">
                  {favoritos.length} finalistas
                </Badge>
              )}
              <ArrowRight className="w-4 h-4" />
            </Button>
            {favoritos.length === 0 && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Marque ao menos 1 nome com estrela para avançar.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
