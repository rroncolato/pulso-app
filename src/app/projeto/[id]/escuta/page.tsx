"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjetoStore } from "@/lib/store/projeto";
import type { Escuta } from "@/types";
import { ArrowRight, Ear, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EscutaPage() {
  const params = useParams();
  const router = useRouter();
  const { projetoAtivo, salvarEscuta } = useProjetoStore();

  const [territorios, setTerritorios] = useState<string[]>(projetoAtivo?.escuta?.territorioConceitual ?? []);
  const [vetores, setVetores] = useState<string[]>(projetoAtivo?.escuta?.vetoresEstrategicos ?? []);
  const [diferenciais, setDiferenciais] = useState(projetoAtivo?.escuta?.diferenciais ?? "");
  const [universo, setUniverso] = useState(projetoAtivo?.escuta?.universoSemantico ?? "");
  const [inputTerritorio, setInputTerritorio] = useState("");
  const [inputVetor, setInputVetor] = useState("");

  function adicionarTag(
    lista: string[],
    setLista: (v: string[]) => void,
    input: string,
    setInput: (v: string) => void
  ) {
    const val = input.trim();
    if (!val || lista.includes(val)) return;
    setLista([...lista, val]);
    setInput("");
  }

  function removerTag(lista: string[], setLista: (v: string[]) => void, item: string) {
    setLista(lista.filter((t) => t !== item));
  }

  function avancar() {
    const escuta: Escuta = {
      territorioConceitual: territorios,
      vetoresEstrategicos: vetores,
      diferenciais,
      universoSemantico: universo,
    };
    salvarEscuta(escuta);
    router.push(`/projeto/${params.id}/invencao`);
  }

  return (
    <div className="px-10 py-10 min-h-screen max-w-3xl mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-pulso-yellow/20 flex items-center justify-center">
          <Ear className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Fase 2</p>
          <h1 className="text-xl font-semibold leading-none">Escuta</h1>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-10">
        A marca começa antes da palavra. Aqui se ouve o cliente, o mercado, o silêncio.
      </p>

      <div className="flex-1 space-y-6">
        {/* Territórios */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">Territórios conceituais</h2>
            <p className="text-[12px] text-muted-foreground">
              Campos semânticos que pertencem a essa marca. Universos de significado.
            </p>
          </div>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="ex: movimento, raiz, aurora..."
              value={inputTerritorio}
              onChange={(e) => setInputTerritorio(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarTag(territorios, setTerritorios, inputTerritorio, setInputTerritorio);
                }
              }}
            />
            <Button variant="outline" size="icon" onClick={() => adicionarTag(territorios, setTerritorios, inputTerritorio, setInputTerritorio)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {territorios.map((t) => (
              <Badge key={t} variant="secondary" className="gap-1.5 pr-1.5">
                {t}
                <button onClick={() => removerTag(territorios, setTerritorios, t)} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Diferenciais */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">Diferenciais reais</h2>
            <p className="text-[12px] text-muted-foreground">
              O que torna essa marca única de verdade — não o que eles gostariam que fosse.
            </p>
          </div>
          <Textarea
            placeholder="ex: É a única clínica com retorno em 24h, atende pelo plano Unimed e tem equipe multidisciplinar no mesmo local."
            rows={3}
            value={diferenciais}
            onChange={(e) => setDiferenciais(e.target.value)}
          />
        </div>

        {/* Universo */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">Universo semântico</h2>
            <p className="text-[12px] text-muted-foreground">
              Palavras soltas, metáforas, imagens, sons — qualquer associação livre com essa marca.
            </p>
          </div>
          <Textarea
            placeholder="ex: pulso, ritmo, fluxo, ponte, espaço branco, manhã, verde-escuro, barro, clareza..."
            rows={4}
            value={universo}
            onChange={(e) => setUniverso(e.target.value)}
          />
        </div>

        {/* Vetores */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">Vetores estratégicos</h2>
            <p className="text-[12px] text-muted-foreground">
              3 a 5 direções que vão guiar a geração de nomes. Cada vetor é uma intenção.
            </p>
          </div>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="ex: Humanidade + tecnologia, Precisão sem frieza..."
              value={inputVetor}
              onChange={(e) => setInputVetor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarTag(vetores, setVetores, inputVetor, setInputVetor);
                }
              }}
            />
            <Button variant="outline" size="icon" onClick={() => adicionarTag(vetores, setVetores, inputVetor, setInputVetor)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {vetores.map((v) => (
              <Badge key={v} className="gap-1.5 pr-1.5 bg-primary text-background hover:bg-primary">
                {v}
                <button onClick={() => removerTag(vetores, setVetores, v)} className="opacity-70 hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 mt-8">
        <Button onClick={avancar} className="w-full gap-2" size="lg">
          Soltar a constelação
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
