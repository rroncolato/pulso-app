"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import type { Projeto } from "@/types";

const EXEMPLO: Projeto = {
  id: "exemplo-roncolato-001",
  titulo: "Clínica Integrar",
  tipologia: "servico",
  status: "em_andamento",
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),

  mapa: {
    nomeCliente: "Clínica Integrar",
    segmento: "Saúde / Medicina Integrativa",
    tipologia: "servico",
    proposta: "Conecta medicina convencional e práticas integrativas em um único espaço, sem burocracia, com retorno em 24h.",
    publicoAlvo: "Mulheres de 28 a 50 anos, classe B/C, Goiânia, que buscam equilíbrio entre saúde física e emocional.",
    concorrentes: "Clínica SaúdePlena, Instituto Harmonia, Espaço Vita",
    personalidade: "Acolhedora, presente, honesta, moderna, humana",
    palavrasProibidas: "plus, smart, pro, clinic, center",
    referencias: "Nubank (pelo tom), Airbnb (pelo acolhimento), O Boticário (pela leveza)",
  },

  escuta: {
    territorioConceitual: ["equilíbrio", "raiz", "presença", "corpo", "movimento", "cuidado", "vínculo"],
    diferenciais: "Única clínica em Goiânia com consultas integradas — médico e terapeuta no mesmo dia, na mesma ficha. Atende pelo plano e também por sessão avulsa.",
    universoSemantico: "enraizar, pulso, ritmo, respirar, fluxo, ponte, manhã, barro, verde-escuro, água parada, calma, inteireza, terreno, semente",
    vetoresEstrategicos: [
      "Cuidado que enraíza, não só que trata",
      "Presença plena — corpo e mente no mesmo lugar",
      "Medicina que escuta antes de prescrever",
    ],
  },

  constelacao: [
    { id: "n01", nome: "Raiz", categoria: "metafórico", recursoLinguistico: "metáfora vegetal", justificativa: "Remete a fundação e pertencimento. O cuidado que vai à origem, não só ao sintoma.", selecionado: false, favorito: true },
    { id: "n02", nome: "Integrar", categoria: "descritivo", recursoLinguistico: "verbo substantivado", justificativa: "Claro, direto, traduz a proposta. Risco de ser literal demais, mas tem fôlego como nome próprio.", selecionado: false, favorito: true },
    { id: "n03", nome: "Terreno", categoria: "metafórico", recursoLinguistico: "metáfora geográfica", justificativa: "Terreno como o corpo — lugar que se prepara, que recebe, que sustenta. Incomum no setor.", selecionado: false, favorito: true },
    { id: "n04", nome: "Vínculo", categoria: "evocativo", recursoLinguistico: "substantivo abstrato", justificativa: "O cuidado como relação, não como transação. Palavra pouco usada em saúde, tem território livre.", selecionado: false, favorito: false },
    { id: "n05", nome: "Enraíza", categoria: "neologismo", recursoLinguistico: "verbo substantivado + acento", justificativa: "Ação de criar raiz. Forte, feminino, incomum. Pode gerar dúvida de pronúncia.", selecionado: false, favorito: false },
    { id: "n06", nome: "Âncora", categoria: "metafórico", recursoLinguistico: "metáfora náutica", justificativa: "Estabilidade, ponto fixo em meio ao movimento. Visual forte, registro provavelmente disponível.", selecionado: false, favorito: false },
    { id: "n07", nome: "Inteira", categoria: "evocativo", recursoLinguistico: "adjetivo substantivado", justificativa: "Inteireza como objetivo da saúde. Feminino, acolhedor, diferente. Ressoa com o público-alvo.", selecionado: false, favorito: true },
    { id: "n08", nome: "Fluxo", categoria: "metafórico", recursoLinguistico: "metáfora de movimento", justificativa: "Saúde como estado de fluxo — nem rigidez, nem caos. Moderno, curto, extensível.", selecionado: false, favorito: false },
  ],

  finalistas: [
    { id: "n01", nome: "Raiz", categoria: "metafórico", recursoLinguistico: "metáfora vegetal", justificativa: "Remete a fundação e pertencimento.", selecionado: true, favorito: true },
    { id: "n02", nome: "Integrar", categoria: "descritivo", recursoLinguistico: "verbo substantivado", justificativa: "Claro, traduz a proposta.", selecionado: true, favorito: true },
    { id: "n03", nome: "Terreno", categoria: "metafórico", recursoLinguistico: "metáfora geográfica", justificativa: "O corpo como território que se prepara.", selecionado: true, favorito: true },
    { id: "n07", nome: "Inteira", categoria: "evocativo", recursoLinguistico: "adjetivo substantivado", justificativa: "Inteireza como objetivo da saúde.", selecionado: true, favorito: true },
  ],

  leituras: [
    {
      nomeAvaliado: "Raiz",
      neumeier: { distinctiveness: 8, brevity: 9, appropriateness: 8, spelling: 10, likability: 9, extendability: 8, protectability: 7 },
      igor: { appearance: 8, distinctive: 8, depth: 9, energy: 7, humanity: 9, positioning: 8, sound: 9, magic: 8, trademark: 7 },
      lentes: {
        registro: { aprovado: true, notas: "Palavra comum — registro deve ser feito como marca mista com elemento visual. Classe 44 (saúde) provavelmente disponível." },
        ruido: { aprovado: true, notas: "Sem conotações negativas em outros idiomas. Em espanhol, 'raíz' tem o mesmo sentido positivo." },
        espelho: { aprovado: false, notas: "Existe 'Raízes' e 'Raiz Natural' no setor de alimentação. No setor de saúde integrativa, território está livre." },
      },
      scoreTotal: 82,
      recomendacao: "A leitura de Raiz veio com pulsação alta. O som é curto e firme, o sentido carrega território profundo — fundação, pertencimento, origem do cuidado. O eixo Espelho acendeu levemente: há uso do termo no setor alimentício, mas na saúde integrativa o nome ainda respira livre. É um nome pronto para passaporte.",
    },
    {
      nomeAvaliado: "Inteira",
      neumeier: { distinctiveness: 9, brevity: 9, appropriateness: 9, spelling: 9, likability: 10, extendability: 9, protectability: 8 },
      igor: { appearance: 7, distinctive: 9, depth: 8, energy: 8, humanity: 10, positioning: 9, sound: 9, magic: 9, trademark: 8 },
      lentes: {
        registro: { aprovado: true, notas: "Adjetivo comum, mas como marca própria no setor saúde tem registro viável. Recomenda-se elemento visual junto." },
        ruido: { aprovado: true, notas: "Sem ruídos. Em outros idiomas mantém conotação positiva de completude." },
        espelho: { aprovado: true, notas: "Nenhuma marca relevante com esse nome no setor de saúde integrativa em Goiânia ou no Brasil." },
      },
      scoreTotal: 88,
      recomendacao: "Inteira tem a pulsação mais alta da short-list. O nome carrega a proposta toda em uma palavra — completude, presença, saúde que não é ausência de doença, é estado pleno. Ressoa com o público feminino sem ser clichê. Extensível em slogan ('Cuide-se inteira'), em sub-marcas ('Inteira Kids', 'Inteira Movimento'). Sem gêmeos no radar. É um nome limpo, pronto para o mundo.",
    },
    {
      nomeAvaliado: "Terreno",
      neumeier: { distinctiveness: 10, brevity: 8, appropriateness: 7, spelling: 9, likability: 7, extendability: 8, protectability: 9 },
      igor: { appearance: 7, distinctive: 10, depth: 9, energy: 6, humanity: 8, positioning: 7, sound: 7, magic: 8, trademark: 9 },
      lentes: {
        registro: { aprovado: true, notas: "Território livre no setor saúde. Registro viável como marca mista." },
        ruido: { aprovado: true, notas: "Sem interferências em português. Em inglês, 'terrain' mantém conotação positiva." },
        espelho: { aprovado: true, notas: "Nenhum concorrente relevante com esse nome no setor." },
      },
      scoreTotal: 76,
      recomendacao: "Terreno é o nome mais incomum da lista — e por isso o mais arriscado. A distinção é altíssima: nenhuma clínica no Brasil usa essa metáfora. Mas a adequação imediata é menor: exige que o cliente explique o nome antes de ser compreendido. Vale se a clínica tem disposição para construir o conceito ao longo do tempo. Pulsação mediana, potencial alto.",
    },
  ],
};

export default function SeedPage() {
  const router = useRouter();

  if (process.env.NODE_ENV === "production") {
    router.replace("/dashboard");
    return null;
  }
  const [status, setStatus] = useState("Preparando o exemplo...");

  useEffect(() => {
    const store = {
      state: {
        projetos: [EXEMPLO],
        projetoAtivo: EXEMPLO,
      },
      version: 0,
    };
    localStorage.setItem("pulso-projetos", JSON.stringify(store));
    setStatus("Exemplo criado. Redirecionando...");
    setTimeout(() => router.push(`/projeto/${EXEMPLO.id}/leitura`), 800);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="w-10 h-10 rounded-full bg-pulso-yellow flex items-center justify-center">
        <Zap className="w-5 h-5 text-pulso-yellow-fg" />
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {status}
      </p>
    </div>
  );
}
