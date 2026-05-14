"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Caderno", icon: LayoutDashboard },
  { href: "/dashboard", label: "Projetos", icon: FolderOpen },
];

export function Sidebar() {
  const pathname = usePathname();

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

      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-[10px] font-bold text-muted-foreground">R</span>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground leading-none">Roncolato</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">MVP v0.1</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
