import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { Mapa } from "@/types";

export async function POST(req: Request) {
  const { nome, mapa }: { nome: string; mapa: Mapa } = await req.json();

  const sistema = `Você é Eco, a IA de naming da plataforma Pulso.
Avalie nomes com precisão e serena objetividade.
Retorne apenas JSON válido, sem texto adicional.`;

  const prompt = `Avalie o nome "${nome}" para a seguinte marca:
Segmento: ${mapa.segmento}
Proposta: ${mapa.proposta}
Personalidade: ${mapa.personalidade}
Público: ${mapa.publicoAlvo}
Concorrentes: ${mapa.concorrentes || "não informado"}

Avalie nos seguintes critérios (score de 0 a 10 cada):

Neumeier (7 critérios):
- distinctiveness: quão diferente é dos concorrentes
- brevity: brevidade e resistência a apelidos (ideal: até 4 sílabas)
- appropriateness: adequação ao propósito sem ser literal demais
- spelling: facilidade de escrita e pronúncia
- likability: agrada o ouvido, soa bem
- extendability: extensível em peças, slogans, sub-marcas
- protectability: potencial de registro e domínio

Igor (9 dimensões):
- appearance: comportamento visual (logo, fachada, app)
- distinctive: diferenciação real
- depth: camadas de significado
- energy: vitalidade, potencial de campanha
- humanity: calor humano vs frieza
- positioning: relevância ao setor e posicionamento
- sound: fonética e fluência oral
- magic: magnetismo, boca a boca (fator "33")
- trademark: disponibilidade estimada para registro

Lentes nominativas:
- registro: { aprovado: boolean, notas: string }  — estimativa de registrabilidade
- ruido: { aprovado: boolean, notas: string } — riscos em outras línguas, gírias, distorções
- espelho: { aprovado: boolean, notas: string } — similaridade com marcas existentes

Retorne APENAS este JSON:
{
  "neumeier": { "distinctiveness": 0, "brevity": 0, "appropriateness": 0, "spelling": 0, "likability": 0, "extendability": 0, "protectability": 0 },
  "igor": { "appearance": 0, "distinctive": 0, "depth": 0, "energy": 0, "humanity": 0, "positioning": 0, "sound": 0, "magic": 0, "trademark": 0 },
  "lentes": {
    "registro": { "aprovado": true, "notas": "" },
    "ruido": { "aprovado": true, "notas": "" },
    "espelho": { "aprovado": true, "notas": "" }
  },
  "recomendacao": "frase de 1-2 linhas sobre o nome, no tom da Eco"
}`;

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: sistema,
    prompt,
  });

  try {
    const json = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    const scoreNeumeier = Object.values(json.neumeier as Record<string, number>).reduce((a, b) => a + b, 0);
    const scoreIgor = Object.values(json.igor as Record<string, number>).reduce((a, b) => a + b, 0);
    const scoreTotal = Math.round((scoreNeumeier / 70 + scoreIgor / 90) * 50);
    return Response.json({ ...json, scoreTotal });
  } catch {
    return Response.json({ error: "Eco não conseguiu completar a leitura. Tente novamente." }, { status: 500 });
  }
}
