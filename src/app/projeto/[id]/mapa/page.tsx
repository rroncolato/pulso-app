"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjetoStore } from "@/lib/store/projeto";
import { QBlock } from "@/components/pulso/QBlock";
import type { Mapa } from "@/types";
import { ArrowRight, ArrowLeft, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    key: "nomeCliente" as const,
    question: "Qual é o nome ou codinome do cliente?",
    hint: "Como você chama esse projeto internamente.",
    type: "input" as const,
    placeholder: "ex: Clínica São Lucas, Projeto Âncora...",
    required: true,
  },
  {
    key: "segmento" as const,
    question: "Em qual segmento a marca atua?",
    hint: "Setor, mercado, contexto de negócio.",
    type: "input" as const,
    placeholder: "ex: Saúde, Tecnologia, Educação...",
    required: true,
  },
  {
    key: "proposta" as const,
    question: "Qual é a proposta de valor?",
    hint: "O que essa marca entrega de diferente? Em uma frase.",
    type: "textarea" as const,
    placeholder: "ex: Conecta pacientes a especialistas sem burocracia, em menos de 10 minutos.",
    required: true,
  },
  {
    key: "publicoAlvo" as const,
    question: "Quem é o público-alvo?",
    hint: "Quem vai ouvir esse nome e precisar memorizar.",
    type: "textarea" as const,
    placeholder: "ex: Mulheres de 28 a 45 anos, classe B/C, urbanas, que priorizam saúde preventiva.",
    required: true,
  },
  {
    key: "personalidade" as const,
    question: "Qual é a personalidade da marca?",
    hint: "Se fosse uma pessoa, como seria? Escolha 3 a 5 adjetivos.",
    type: "input" as const,
    placeholder: "ex: Acolhedora, direta, moderna, confiável, leve...",
    required: true,
  },
  {
    key: "concorrentes" as const,
    question: "Quais são os concorrentes diretos?",
    hint: "Nomes que já existem nesse mercado — o que devemos evitar soar igual.",
    type: "input" as const,
    placeholder: "ex: Doctoralia, Consulta Remédios, Telemedicina Brasil...",
    required: false,
  },
  {
    key: "palavrasProibidas" as const,
    question: "Existem palavras proibidas?",
    hint: "Termos que não podem aparecer — por contexto, concorrência ou preferência.",
    type: "input" as const,
    placeholder: "ex: smart, plus, pro, saúde, clinic...",
    required: false,
  },
  {
    key: "referencias" as const,
    question: "Quais são as referências e inspirações?",
    hint: "Marcas de fora do setor que o cliente admira — pelo nome, visual ou tom.",
    type: "input" as const,
    placeholder: "ex: Apple, Nubank, Magazine Luiza, Airbnb...",
    required: false,
  },
];

export default function MapaPage() {
  const params = useParams();
  const router = useRouter();
  const { projetoAtivo, salvarMapa } = useProjetoStore();
  const [currentStep, setCurrentStep] = useState(0);

  const { register, handleSubmit, watch, formState: { isValid } } = useForm<Mapa>({
    defaultValues: projetoAtivo?.mapa,
  });

  const values = watch();

  function onSubmit(data: Mapa) {
    salvarMapa(data);
    router.push(`/projeto/${params.id}/escuta`);
  }

  const currentQuestion = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;
  const isAnswered = values[currentQuestion.key];

  return (
    <div className="px-10 py-10 min-h-screen max-w-2xl mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 rounded-lg bg-pulso-yellow/20 flex items-center justify-center">
          <Map className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Fase 1</p>
          <h1 className="text-xl font-semibold leading-none">Mapa</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        {/* Q-Block */}
        <div className="flex-1">
          <QBlock
            number={currentStep + 1}
            total={QUESTIONS.length}
            question={currentQuestion.question}
            hint={currentQuestion.hint}
            optional={!currentQuestion.required}
          >
            {currentQuestion.type === "input" ? (
              <Input
                placeholder={currentQuestion.placeholder}
                {...register(currentQuestion.key, { required: currentQuestion.required })}
                className="text-base"
                autoFocus
              />
            ) : (
              <Textarea
                placeholder={currentQuestion.placeholder}
                rows={3}
                {...register(currentQuestion.key, { required: currentQuestion.required })}
                className="text-base"
                autoFocus
              />
            )}
          </QBlock>
        </div>

        {/* Navigation */}
        <div className="pt-12 flex gap-3 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          {isLastStep ? (
            <Button type="submit" className="flex-1 gap-2" size="lg">
              Avançar para a Escuta
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 gap-2"
              size="lg"
              disabled={currentQuestion.required && !isAnswered}
            >
              Próxima
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
