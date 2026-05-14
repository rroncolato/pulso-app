import { ProjetoNav } from "@/components/pulso/ProjetoNav";
import { StoreProvider } from "@/components/pulso/StoreProvider";

export default function ProjetoLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <ProjetoNav />
        <main className="flex-1 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
