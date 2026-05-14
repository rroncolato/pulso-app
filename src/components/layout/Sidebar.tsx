"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Zap, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ nome: string; email: string } | null>(null);
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          nome: user.user_metadata?.nome ?? user.email?.split("@")[0] ?? "Usuário",
          email: user.email ?? "",
        });
      }
    });
  }, []);

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const nav = [
    { href: "/dashboard", label: "Caderno", icon: LayoutDashboard },
    ...(isAdmin ? [{ href: "/admin", label: "Todos os clientes", icon: ShieldCheck }] : []),
  ];

  return (
    <aside className="w-52 min-h-screen border-r border-border flex flex-col bg-card shrink-0">
      {/* Logo */}
      <div className="px-5 py-7 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-sm leading-none tracking-tight text-foreground">Pulso</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">Naming com método</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 mb-0.5",
              pathname === href
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-border">
        {user && (
          <div className="mb-3">
            <p className="text-xs font-medium text-foreground leading-none truncate">{user.nome}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={sair}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
