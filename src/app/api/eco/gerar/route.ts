import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { Mapa, Escuta } from "@/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "sua_chave_aqui") {
    return Response.json({ error: "ANTHROPIC_API_KEY não configurada no .env.local" }, { status: 500 });
  }

  const { mapa, escuta }: { mapa: Mapa; escuta: Escuta } = await req.json();

  const sistema = `Você é Eco, a IA da plataforma Pulso do Estúdio Roncolato.
Colaboradora pensante de naming. Frases curtas. Nunca usa emoji. Não bajula.
Gere nomes para marcas usando recursos linguísticos da metodologia Nammy (TheUglyLab).

Recursos: metáfora, metonímia, neologismo, aglutinação, truncamento, aliteração, assonância,
estrangeirismos adaptados, latinismos, helenismos, anagramas, acrônimos, recortes silábicos,
justaposição, sufixação criativa, palavras-valise (portmanteau).

Retorne APENAS JSON válido, sem texto antes ou depois:
{
  "nomes": [
    {
      "nome": "NomeAqui",
      "categoria": "evocativo|descritivo|abstrato|neologismo|acrônimo|metafórico",
      "recursoLinguistico": "recurso usado",
      "justificativa": "justificativa em 1-2 frases curtas"
    }
  ]
}`;

  const prompt = `Cliente: ${mapa.nomeCliente}
Segmento: ${mapa.segmento}
Proposta de valor: ${mapa.proposta}
Público: ${mapa.publicoAlvo}
Personalidade: ${mapa.personalidade}
Palavras proibidas: ${mapa.palavrasProibidas || "nenhuma"}
Concorrentes a evitar soar igual: ${mapa.concorrentes || "nenhum listado"}
Territórios conceituais: ${escuta.territorioConceitual.join(", ") || "a definir"}
Vetores estratégicos: ${escuta.vetoresEstrategicos.join(" · ") || "a definir"}
Universo semântico: ${escuta.universoSemantico || "livre"}

Gere exatamente 20 nomes. Varie os recursos linguísticos. Retorne apenas o JSON.`;

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: sistema,
      prompt,
    });

    const clean = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return Response.json({ error: msg }, { status: 500 });
  }
}
