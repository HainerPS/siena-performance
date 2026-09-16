"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/client";

interface DeleteExerciseButtonProps {
  workoutExerciseId: string;
  onDeleted?: () => void;
}

export function DeleteExerciseButton({
  workoutExerciseId,
  onDeleted,
}: DeleteExerciseButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja remover este exercício do treino?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("workout_exercises")
      .delete()
      .eq("id", workoutExerciseId);

    if (error) {
      console.error(
        "Erro ao remover exercício:",
        error,
      );
      alert("Não foi possível remover o exercício.");
      setDeleting(false);
      return;
    }

    setDeleting(false);
    onDeleted?.();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="text-muted-foreground hover:text-destructive"
    >
      {deleting ? "Removendo..." : "Remover"}
    </Button>
  );
}