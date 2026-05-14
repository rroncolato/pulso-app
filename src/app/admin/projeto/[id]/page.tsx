"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const eixosNeumeier = [
  { key: "distinctiveness", label: "Distinção" },
  { key: "brevity", label: "Brevidade" },
  { key: "appropriateness", label: "Adequação" },
  { key: "spelling", label: "Fluência" },
  { key: "likability", label: "Simpatia" },
  { key: "extendability", label: "Extensão" },
  { key: "protectability", label: "Proteção" },
];

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
];

export default function AdminProjetoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projeto, setProjeto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`/api/admin/projeto/${id}`);
      if (res.status === 403) { router.push("/dashboard"); return; }
      if (res.status === 404) { setErro("Projeto não encontrado."); setCarregando(false); return; }
      const data = await res.json();
      setProjeto(data.projeto);
      setCarregando(false);
    }
    carregar();
  }, [id]);

  if (carregando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (erro) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-muted-foreground">{erro}</p>
      <Button variant="outline" onClick={() => router.push("/admin")}>Voltar</Button>
    </div>
  );

  const leituras: any[] = projeto?.leituras ?? [];
  const finalistas: any[] = projeto?.finalistas ?? [];
  const mapa = projeto?.mapa;
  const melhor = [...leituras].sort((a, b) => b.scoreTotal - a.scoreTotal)[0];

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { background: white !important; color: black !important; padding: 0 !important; max-width: 100% !important; }
          .print-area * { color: inherit !important; border-color: #e5e7eb !important; }
          .print-card { background: #f9fafb !important; }
          .print-igor-card { background: white !important; border: 1px solid #e5e7eb !important; }
          .print-lente-ok { background: #f0fdf4 !important; border-color: #bbf7d0 !important; }
          .print-lente-warn { background: #fffbeb !important; border-color: #fde68a !important; }
          .print-rec { background: white !important; border: 2px solid black !important; }
          .print-bar { background: #e5e7eb !important; }
          .print-bar-fill { background: black !important; }
          .print-capa { page-break-after: always; padding: 60px 50px; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
          .print-nome-page { page-break-before: always; page-break-after: always; page-break-inside: avoid; padding: 50px; min-height: 100vh; box-sizing: border-box; border-bottom: none !important; margin: 0 !important; }
          .print-pagina-final { page-break-before: always; padding: 60px 50px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
        }
      `}</style>

      <div className="px-10 py-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin")} className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                {projeto.clienteNome} · {projeto.clienteEmail}
              </p>
              <h1 className="text-xl font-semibold leading-none">{projeto.titulo}</h1>
            </div>
          </div>
          <Button onClick={() => window.print()} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        <div className="print-area space-y-0">

          {/* Capa */}
          <div className="print-capa border-b border-border pb-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Passaporte de Naming</p>
                <h2 className="text-3xl font-bold text-foreground">{projeto.titulo}</h2>
                <p className="text-sm text-muted-foreground mt-2">{projeto.clienteNome}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">Estúdio Roncolato</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(projeto.atualizadoEm).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          {/* Briefing */}
          {mapa && (
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Briefing</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {mapa.segmento && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">Segmento</span>
                    <span className="text-foreground font-medium">{mapa.segmento}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">Tipologia</span>
                  <span className="text-foreground font-medium capitalize">{projeto.tipologia}</span>
                </div>
                {mapa.proposta && (
                  <div className="col-span-2 flex gap-2">
                    <span className="text-muted-foreground shrink-0">Proposta</span>
                    <span className="text-foreground">{mapa.proposta}</span>
                  </div>
                )}
                {mapa.personalidade && (
                  <div className="col-span-2 flex gap-2">
                    <span className="text-muted-foreground shrink-0">Personalidade</span>
                    <span className="text-foreground">{mapa.personalidade}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Finalistas */}
          {finalistas.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Finalistas avaliados</p>
              <div className="flex gap-2 flex-wrap">
                {finalistas.map((n: any) => (
                  <span key={n.id} className="border border-border text-foreground px-3 py-1 text-sm font-semibold rounded-full">
                    {n.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          {leituras.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="font-medium">Nenhuma leitura gerada ainda.</p>
              <p className="text-sm mt-1">O cliente ainda não chegou à fase de avaliação.</p>
            </div>
          )}

          {/* Leituras */}
          {leituras.map((leitura: any) => (
            <div key={leitura.nomeAvaliado} className="print-nome-page mb-10 pb-10 border-b border-border last:border-0">
              <div className="flex items-start justify-between mb-5">
                <h3 className="text-2xl font-bold text-foreground">{leitura.nomeAvaliado}</h3>
                <div className="text-right">
                  <p className="text-4xl font-bold text-primary leading-none">{leitura.scoreTotal}</p>
                  <p className="text-xs text-muted-foreground mt-1">pulsação</p>
                </div>
              </div>

              <div className="print-card bg-muted/50 rounded-xl p-4 mb-6 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Eco diz</p>
                <p className="text-sm text-foreground leading-relaxed">{leitura.recomendacao}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Eixos Neumeier</p>
                  <div className="space-y-2.5">
                    {eixosNeumeier.map(({ key, label }) => {
                      const val = leitura.neumeier?.[key] ?? 0;
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground">{label}</span>
                            <span className="font-bold text-foreground tabular-nums">{val}/10</span>
                          </div>
                          <div className="print-bar h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="print-bar-fill h-full rounded-full bg-primary transition-all" style={{ width: `${val * 10}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Dimensões Igor</p>
                  <div className="grid grid-cols-3 gap-2">
                    {dimensoesIgor.map(({ key, label }) => (
                      <div key={key} className="print-igor-card bg-muted/50 border border-border rounded-xl p-2 text-center">
                        <p className="text-xl font-bold text-foreground leading-none">{leitura.igor?.[key] ?? 0}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(["registro", "ruido", "espelho"] as const).map((lente) => {
                  const aprovado = leitura.lentes?.[lente]?.aprovado ?? false;
                  const notas = leitura.lentes?.[lente]?.notas ?? "";
                  const Icon = aprovado ? CheckCircle2 : lente === "espelho" ? AlertCircle : XCircle;
                  const labels = { registro: "Registro", ruido: "Ruído", espelho: "Espelho" };
                  return (
                    <div key={lente} className={cn(
                      "rounded-xl p-3.5 border",
                      aprovado ? "print-lente-ok border-emerald-500/30 bg-emerald-500/10" : "print-lente-warn border-amber-500/30 bg-amber-500/10"
                    )}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon className={cn("w-3.5 h-3.5 shrink-0", aprovado ? "text-emerald-400" : "text-amber-400")} />
                        <span className="text-xs font-semibold text-foreground">{labels[lente]}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {notas || (aprovado ? "Sem interferências." : "Requer atenção.")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {melhor && (
            <div className="print-pagina-final print-rec border-2 border-primary/40 bg-primary/5 rounded-2xl p-6 mt-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Recomendação final</p>
              <p className="text-3xl font-bold text-foreground mb-1">{melhor.nomeAvaliado}</p>
              <p className="text-sm text-muted-foreground">Maior pulsação entre os finalistas — {melhor.scoreTotal} pontos.</p>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">Gerado pelo Pulso · Estúdio Roncolato · {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
