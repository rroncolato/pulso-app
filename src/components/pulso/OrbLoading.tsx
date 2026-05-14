"use client";

export function OrbLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Orb */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin"
          style={{ animationDuration: "2s" }}
        />
        <div
          className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"
          style={{ animationDuration: "1.5s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-foreground mb-1">Inventando possibilidades...</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Eco está gerando 20 nomes a partir do seu mapa e escuta.
      </p>
    </div>
  );
}
