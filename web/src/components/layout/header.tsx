"use client";

import { useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Olá, Gabriel 👋
        </h2>

        <p className="text-sm text-muted-foreground">
          Tenha um ótimo treino hoje.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {mounted ? (
            isDark ? <Sun size={20} /> : <Moon size={20} />
          ) : (
            <Moon size={20} />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Notificações"
        >
          <Bell size={20} />
        </Button>

        <Avatar className="rounded-xl ring-1 ring-border">
          <AvatarFallback className="rounded-xl bg-sidebar font-medium text-sidebar-foreground">
            GS
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}