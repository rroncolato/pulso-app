"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ArrowLeft, Zap, Map, Ear, Sparkles, BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjetoStore } from "@/lib/store/projeto";

const fases = [
  { slug: "mapa",       label: "Mapa",      descricao: "Briefing",     icon: Map,      modo: "creator" },
  { slug: "escuta",     label: "Escuta",    descricao: "Investigação",  icon: Ear,      modo: "creator" },
  { slug: "invencao",   label: "Invenção",  descricao: "Geração",      icon: Sparkles, modo: "creator" },
  { slug: "leitura",    label: "Leitura",   descricao: "Diagnóstico",  icon: BookOpen, modo: "sage" },
  { slug: "passaporte", label: "Passaporte",descricao: "Relatório",    icon: FileText, modo: "sage" },
];

export function ProjetoNav() {
  const pathname = usePathname();
  const params = useParams();
  const id = params.id as string;
  const { projetoAtivo } = useProjetoStore();

  const faseAtual = fases.findIndex((f) => pathname.includes(f.slug));

  return (
    <aside className="w-52 min-h-screen border-r border-border flex flex-col bg-card shrink-0">
      {/* Logo + voltar */}
      <div className="px-5 py-5 border-b border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Caderno
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">Pulso</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Naming com método</p>
          </div>
        </div>
        {projetoAtivo && (
          <div className="mt-3 px-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Projeto ativo</p>
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
              {projetoAtivo.titulo}
            </p>
          </div>
        )}
      </div>

      {/* Fases */}
      <div className="px-3 py-2 mt-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-3 mb-2">
          Etapas do processo
        </p>
        {fases.map(({ slug, label, descricao, icon: Icon, modo }, idx) => {
          const href = `/projeto/${id}/${slug}`;
          const ativo = pathname.includes(slug);
          const concluido = idx < faseAtual;
          const isSage = modo === "sage";

          return (
            <Link
              key={slug}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 mb-0.5 group",
                ativo
                  ? isSage
                    ? "bg-foreground/10 text-foreground"
                    : "bg-primary/10 text-primary"
                  : concluido
                  ? "text-foreground/60 hover:text-foreground hover:bg-muted/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                ativo
                  ? isSage ? "bg-foreground/10" : "bg-primary/20"
                  : "bg-muted/50"
              )}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-none">{label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{descricao}</p>
              </div>
              {concluido && !ativo && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Barra de progresso */}
      <div className="mt-auto px-5 py-5 border-t border-border">
        <div className="flex gap-1 mb-2">
          {fases.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                idx <= faseAtual ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Fase {faseAtual + 1} de {fases.length}
        </p>
      </div>
    </aside>
  );
}
