"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QBlockProps {
  number: number;
  total: number;
  question: string;
  hint?: string;
  children: ReactNode;
  optional?: boolean;
}

export function QBlock({
  number,
  total,
  question,
  hint,
  children,
  optional = false,
}: QBlockProps) {
  const progress = (number / total) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground font-medium">
          {number} de {total}
        </p>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground leading-tight">{question}</h2>
          {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
          {optional && <p className="text-xs text-pulso-yellow font-medium">Opcional</p>}
        </div>

        {/* Input area */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
