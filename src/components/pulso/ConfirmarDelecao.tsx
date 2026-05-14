"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  aberto: boolean;
  titulo: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmarDelecao({ aberto, titulo, onConfirmar, onCancelar }: Props) {
  const [confirmacao, setConfirmacao] = useState("");
  const confirmado = confirmacao.trim().toLowerCase() === "deletar";

  function handleConfirmar() {
    if (!confirmado) return;
    onConfirmar();
    setConfirmacao("");
  }

  function handleCancelar() {
    setConfirmacao("");
    onCancelar();
  }

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCancelar} />
      <div className="relative bg-card border border-destructive/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">

        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight mb-1">Deletar projeto?</h2>
            <p className="text-sm text-muted-foreground leading-snug">
              O projeto <span className="font-semibold text-foreground">"{titulo}"</span> e todos os seus dados serão apagados permanentemente.
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-border mb-5">
          <p className="text-xs text-muted-foreground mb-2.5">
            Para confirmar, digite <span className="font-bold text-foreground font-mono">deletar</span> abaixo:
          </p>
          <Input
            placeholder="deletar"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
            className={cn(
              "bg-card border-border transition-colors",
              confirmado && "border-destructive/50 focus:border-destructive"
            )}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancelar}
            className="flex-1 border-border"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!confirmado}
            className="flex-1 gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            Deletar
          </Button>
        </div>
      </div>
    </div>
  );
}
