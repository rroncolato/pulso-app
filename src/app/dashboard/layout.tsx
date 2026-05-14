import { Sidebar } from "@/components/layout/Sidebar";
import { StoreProvider } from "@/components/pulso/StoreProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
