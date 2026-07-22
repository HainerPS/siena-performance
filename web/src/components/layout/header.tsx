import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <h2 className="text-lg font-semibold">
          Olá, Gabriel 👋
        </h2>

        <p className="text-sm text-muted-foreground">
          Tenha um ótimo treino hoje.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
        >
          <Bell size={20} />
        </Button>

        <Avatar>
          <AvatarFallback>
            GS
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}