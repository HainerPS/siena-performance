"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createClient } from "@/lib/supabase/client";

interface EditStudentDialogProps {
  studentId: string;
  initialName: string;
  initialGoal: string;
  initialStatus: string;
  onStudentUpdated?: () => void;
}

export function EditStudentDialog({
  studentId,
  initialName,
  initialGoal,
  initialStatus,
  onStudentUpdated,
}: EditStudentDialogProps) {
  const [name, setName] = useState(initialName);
  const [goal, setGoal] = useState(initialGoal);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdateStudent() {
    if (!name.trim()) {
      alert("Digite o nome do aluno.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("students")
      .update({
        name: name.trim(),
        goal: goal.trim() || null,
        status,
      })
      .eq("id", studentId);

    if (error) {
      console.error(error);
      alert("Não foi possível atualizar o aluno.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onStudentUpdated?.();
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="rounded-xl"
          >
            Editar
          </Button>
        }
      />

      <DialogContent className="border-border bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Editar aluno
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nome do aluno"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Input
            placeholder="Objetivo (ex: Hipertrofia)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>

          <Button
            onClick={handleUpdateStudent}
            disabled={loading}
            className="w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}