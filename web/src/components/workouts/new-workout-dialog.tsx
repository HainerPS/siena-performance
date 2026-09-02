"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export function NewWorkoutDialog() {
  return (
    <Dialog>
     <DialogTrigger
  render={
    <Button className="rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
      + Novo treino
    </Button>
  }
/>

      <DialogContent className="border-border bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Novo treino
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nome do treino"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Input
            placeholder="Descrição"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Input
            placeholder="Quantidade de exercícios"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Button className="w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
            Salvar treino
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}