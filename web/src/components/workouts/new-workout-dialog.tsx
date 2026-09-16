"use client";

import { useEffect, useState } from "react";

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

interface Student {
  id: string;
  name: string;
}

interface NewWorkoutDialogProps {
  onWorkoutCreated?: () => void;
}

export function NewWorkoutDialog({
  onWorkoutCreated,
}: NewWorkoutDialogProps) {
  const [open, setOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("students")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error(
          "Erro ao carregar alunos:",
          error,
        );

        setLoadingStudents(false);
        return;
      }

      setStudents(data ?? []);
      setLoadingStudents(false);
    }

    loadStudents();
  }, []);

  async function handleCreateWorkout() {
    if (!studentId) {
      alert("Selecione um aluno.");
      return;
    }

    if (!name.trim()) {
      alert("Digite o nome do treino.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("workouts")
      .insert({
        trainer_id: user.id,
        student_id: studentId,
        name: name.trim(),
        description: description.trim() || null,
      });

    if (error) {
      console.error(
        "Erro ao criar treino:",
        error,
      );

      alert("Não foi possível criar o treino.");
      setLoading(false);
      return;
    }

    setStudentId("");
    setName("");
    setDescription("");

    setLoading(false);
    setOpen(false);

    onWorkoutCreated?.();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
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
          <select
            value={studentId}
            onChange={(event) =>
              setStudentId(event.target.value)
            }
            disabled={loadingStudents || loading}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="">
              {loadingStudents
                ? "Carregando alunos..."
                : "Selecione o aluno"}
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Nome do treino (ex: Treino A)"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            disabled={loading}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Input
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            disabled={loading}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Button
            onClick={handleCreateWorkout}
            disabled={loading}
            className="w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {loading
              ? "Salvando..."
              : "Salvar treino"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}