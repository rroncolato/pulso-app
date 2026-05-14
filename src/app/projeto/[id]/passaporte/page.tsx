"use client";

import { useRef } from "react";
import { useProjetoStore } from "@/lib/store/projeto";
import { FileText, Download, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const eixosNeumeier = [
  { key: "distinctiveness" as const, label: "Distinção" },
  { key: "brevity" as const, label: "Brevidade" },
  { key: "appropriateness" as const, label: "Adequação" },
  { key: "spelling" as const, label: "Fluência" },
  { key: "likability" as const, label: "Simpatia" },
  { key: "extendability" as const, label: "Extensão" },
  { key: "protectability" as const, label: "Proteção" },
];

const dimensoesIgor = [
  { key: "appearance" as const, label: "Visual" },
  { key: "distinctive" as const, label: "Distinção" },
  { key: "depth" as const, label: "Profundidade" },
  { key: "energy" as const, label: "Energia" },
  { key: "humanity" as const, label: "Humanidade" },
  { key: "positioning" as const, label: "Posição" },
  { key: "sound" as const, label: "Som" },
  { key: "magic" as const, label: "Magnetismo" },
  { key: "trademark" as const, label: "Marca" },
];

export default function PassaportePage() {
  const printRef = useRef<HTMLDivElement>(null);
  const { projetoAtivo } = useProjetoStore();

  function exportarPDF() {
    window.print();
  }

  if (!projetoAtivo) return null;

  const { leituras = [], finalistas = [], mapa } = projetoAtivo;
  const melhor = [...leituras].sort((a, b) => b.scoreTotal - a.scoreTotal)[0];

  return (
    <>
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }

          body, html { margin: 0; padding: 0; }

          .print-area {
            background: white !important;
            color: #111 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .print-area * {
            color: inherit !important;
            border-color: #e5e7eb !important;
          }
          .print-card { background: #f9fafb !important; }
          .print-igor-card { background: #f9fafb !important; border: 1px solid #e5e7eb !important; }
          .print-lente-ok { background: #f0fdf4 !important; border-color: #bbf7d0 !important; }
          .print-lente-warn { background: #fffbeb !important; border-color: #fde68a !important; }
          .print-rec { background: #fafafa !important; border: 2px solid #111 !important; }
          .print-bar { background: #e5e7eb !important; }
          .print-bar-fill { background: #111 !important; }

          .print-capa {
            padding-bottom: 24px;
            margin-bottom: 24px;
            border-bottom: 1px solid #e5e7eb !important;
          }

          .print-nome-page {
            break-before: page;
            page-break-before: always;
            break-inside: avoid;
            page-break-inside: avoid;
            padding-top: 32px;
            border-bottom: none !important;
            margin-bottom: 0 !important;
          }

          .print-nome-page:first-of-type {
            break-before: auto;
            page-break-before: auto;
          }

          .print-pagina-final {
            break-before: page;
            page-break-before: always;
            padding-top: 32px;
          }

          .print-rodape {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb !important;
          }
        }
      `}</style>

      <div className="px-10 py-10 max-w-3xl mx-auto">

        {/* Header — só na tela */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Fase 5</p>
              <h1 className="text-xl font-semibold leading-none">Passaporte</h1>
            </div>
          </div>
          <Button onClick={exportarPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        {/* Conteúdo — tela escura + PDF branco */}
        <div ref={printRef} className="print-area space-y-0">

          {/* Cabeçalho do passaporte — vira a capa no PDF */}
          <div className="print-capa border-b border-border pb-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Passaporte de Naming
                </p>
                <h2 className="text-3xl font-bold text-foreground">{projetoAtivo.titulo}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">Estúdio Roncolato</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(projetoAtivo.atualizadoEm).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          {/* Briefing */}
          {mapa && (
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Briefing
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">Segmento</span>
                  <span className="text-foreground font-medium">{mapa.segmento}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">Tipologia</span>
                  <span className="text-foreground font-medium capitalize">{projetoAtivo.tipologia}</span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <span className="text-muted-foreground shrink-0">Proposta</span>
                  <span className="text-foreground">{mapa.proposta}</span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <span className="text-muted-foreground shrink-0">Personalidade</span>
                  <span className="text-foreground">{mapa.personalidade}</span>
                </div>
              </div>
            </div>
          )}

          {/* Finalistas */}
          {finalistas.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Finalistas avaliados
              </p>
              <div className="flex gap-2 flex-wrap">
                {finalistas.map((n) => (
                  <span
                    key={n.id}
                    className="border border-border text-foreground px-3 py-1 text-sm font-semibold rounded-full"
                  >
                    {n.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Leituras — cada uma em página própria no PDF */}
          {leituras.map((leitura) => (
            <div
              key={leitura.nomeAvaliado}
              className="print-nome-page mb-10 pb-10 border-b border-border last:border-0"
            >
              {/* Nome + score */}
              <div className="flex items-start justify-between mb-5">
                <h3 className="text-2xl font-bold text-foreground">{leitura.nomeAvaliado}</h3>
                <div className="text-right">
                  <p className="text-4xl font-bold text-primary leading-none">{leitura.scoreTotal}</p>
                  <p className="text-xs text-muted-foreground mt-1">pulsação</p>
                </div>
              </div>

              {/* Eco diz */}
              <div className="print-card bg-muted/50 rounded-xl p-4 mb-6 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Eco diz</p>
                <p className="text-sm text-foreground leading-relaxed">{leitura.recomendacao}</p>
              </div>

              {/* Neumeier + Igor */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Eixos Neumeier
                  </p>
                  <div className="space-y-2.5">
                    {eixosNeumeier.map(({ key, label }) => {
                      const val = leitura.neumeier[key];
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground">{label}</span>
                            <span className="font-bold text-foreground tabular-nums">{val}/10</span>
                          </div>
                          <div className="print-bar h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="print-bar-fill h-full rounded-full bg-primary transition-all"
                              style={{ width: `${val * 10}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Dimensões Igor
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {dimensoesIgor.map(({ key, label }) => (
                      <div
                        key={key}
                        className="print-igor-card bg-muted/50 border border-border rounded-xl p-2 text-center"
                      >
                        <p className="text-xl font-bold text-foreground leading-none">{leitura.igor[key]}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lentes nominativas */}
              <div className="grid grid-cols-3 gap-3">
                {(["registro", "ruido", "espelho"] as const).map((lente) => {
                  const { aprovado, notas } = leitura.lentes[lente];
                  const Icon = aprovado ? CheckCircle2 : lente === "espelho" ? AlertCircle : XCircle;
                  const labels = { registro: "Registro", ruido: "Ruído", espelho: "Espelho" };
                  return (
                    <div
                      key={lente}
                      className={cn(
                        "rounded-xl p-3.5 border",
                        aprovado
                          ? "print-lente-ok border-emerald-500/30 bg-emerald-500/10"
                          : "print-lente-warn border-amber-500/30 bg-amber-500/10"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon className={cn(
                          "w-3.5 h-3.5 shrink-0",
                          aprovado ? "text-emerald-400" : "text-amber-400"
                        )} />
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

          {/* Recomendação final — página própria no PDF */}
          {melhor && (
            <div className="print-pagina-final print-rec border-2 border-primary/40 bg-primary/5 rounded-2xl p-6 mt-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                Recomendação final
              </p>
              <p className="text-3xl font-bold text-foreground mb-1">{melhor.nomeAvaliado}</p>
              <p className="text-sm text-muted-foreground">
                Maior pulsação entre os finalistas — {melhor.scoreTotal} pontos.
              </p>
            </div>
          )}

          {/* Rodapé */}
          <div className="print-rodape mt-12 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Gerado pelo Pulso · Estúdio Roncolato · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
