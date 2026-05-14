"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Projeto } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProjetoAdmin extends Projeto {
  clienteNome: string;
  clienteEmail: string;
}

export default function AdminPage() {
  const [projetos, setProjetos] = useState<ProjetoAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function carregar() {
      const res = await fetch("/api/admin/projetos");
      if (res.status === 403) { router.push("/dashboard"); return; }
      const data = await res.json();
      setProjetos(data.projetos ?? []);
      setCarregando(false);
    }
    carregar();
  }, []);

  if (carregando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalClientes = new Set(projetos.map((p) => p.clienteEmail)).size;

  return (
    <div className="px-10 py-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Super Admin</p>
          <h1 className="text-xl font-semibold leading-none">Todos os projetos</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Projetos", value: projetos.length },
          { label: "Clientes", value: totalClientes },
          { label: "Finalizados", value: projetos.filter((p) => p.status === "finalizado").length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {projetos.map((projeto) => (
          <Link key={projeto.id} href={`/admin/projeto/${projeto.id}`} className="block">
          <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  <h3 className="font-semibold text-base">{projeto.titulo}</h3>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    projeto.status === "finalizado" ? "bg-emerald-500/10 text-emerald-400" :
                    projeto.status === "em_andamento" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {projeto.status === "finalizado" ? "Finalizado" : projeto.status === "em_andamento" ? "Em andamento" : "Rascunho"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {projeto.clienteNome} · <span className="text-xs">{projeto.clienteEmail}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">
                  {new Date(projeto.atualizadoEm).toLocaleDateString("pt-BR")}
                </p>
                {projeto.finalistas && projeto.finalistas.length > 0 && (
                  <div className="flex gap-1 flex-wrap justify-end mt-2">
                    {projeto.finalistas.slice(0, 3).map((n) => (
                      <span key={n.id} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        {n.nome}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          </Link>
        ))}

        {projetos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-medium">Nenhum projeto ainda.</p>
            <p className="text-sm mt-1">Os projetos dos clientes aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}
