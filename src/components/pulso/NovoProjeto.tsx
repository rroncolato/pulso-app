"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjetoStore } from "@/lib/store/projeto";
import type { Projeto } from "@/types";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

const tipologias: { value: Projeto["tipologia"]; label: string; descricao: string }[] = [
  { value: "corporativo", label: "Corporativo", descricao: "Empresa ou instituição" },
  { value: "produto",     label: "Produto",     descricao: "Item ou linha de produtos" },
  { value: "servico",     label: "Serviço",     descricao: "Serviço ou plataforma" },
  { value: "personagem",  label: "Personagem",  descricao: "Mascote, IA ou editorial" },
];

export function NovoProjeto({ aberto, onFechar }: Props) {
  const [titulo, setTitulo] = useState("");
  const [tipologia, setTipologia] = useState<Projeto["tipologia"]>("corporativo");
  const { criarProjeto } = useProjetoStore();
  const router = useRouter();

  function criar() {
    if (!titulo.trim()) return;
    const projeto = criarProjeto(titulo.trim(), tipologia);
    onFechar();
    setTitulo("");
    router.push(`/projeto/${projeto.id}/mapa`);
  }

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-none">Novo projeto</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Comece pelo que a marca sente.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
              Nome do projeto
            </label>
            <Input
              placeholder="ex: Clínica Saúde Plena, App Finanças..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && criar()}
              autoFocus
              className="bg-muted border-border focus:border-primary"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Use o nome do cliente ou um codinome para o projeto.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
              Tipologia
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tipologias.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipologia(t.value)}
                  className={cn(
                    "text-left px-3.5 py-3 rounded-xl border transition-all duration-150",
                    tipologia === t.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-border/80 bg-muted/50 hover:bg-muted"
                  )}
                >
                  <p className={cn("text-sm font-semibold", tipologia === t.value && "text-primary")}>
                    {t.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.descricao}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <Button variant="outline" onClick={onFechar} className="flex-1 border-border">
            Cancelar
          </Button>
          <Button onClick={criar} disabled={!titulo.trim()} className="flex-1 font-semibold">
            Começar o mapa
          </Button>
        </div>
      </div>
    </div>
  );
}
