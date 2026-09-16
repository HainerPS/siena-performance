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

interface Exercise {
  id: string;
  name: string;
  description: string | null;
}

interface AddExerciseDialogProps {
  workoutId: string;
  onExerciseAdded?: () => void;
}

export function AddExerciseDialog({
  workoutId,
  onExerciseAdded,
}: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] =
    useState("");

  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");

  const [restMinutes, setRestMinutes] = useState("");
  const [restSeconds, setRestSeconds] = useState("");

  const [loadingExercises, setLoadingExercises] =
    useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadExercises() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("exercises")
        .select("id, name, description")
        .order("name", { ascending: true });

      if (error) {
        console.error(
          "Erro ao carregar exercícios:",
          error,
        );

        setLoadingExercises(false);
        return;
      }

      setExercises(data ?? []);
      setLoadingExercises(false);
    }

    loadExercises();
  }, []);

  async function handleAddExercise() {
    if (!selectedExerciseId) {
      alert("Selecione um exercício.");
      return;
    }

    if (!sets || !repetitions) {
      alert("Informe séries e repetições.");
      return;
    }

    const minutes = restMinutes
      ? Number(restMinutes)
      : 0;

    const seconds = restSeconds
      ? Number(restSeconds)
      : 0;

    if (seconds > 59) {
      alert("Os segundos devem estar entre 0 e 59.");
      return;
    }

    const totalRestSeconds =
      minutes * 60 + seconds;

    setSaving(true);

    const supabase = createClient();

    const {
      data: existingExercises,
      error: existingError,
    } = await supabase
      .from("workout_exercises")
      .select("position")
      .eq("workout_id", workoutId)
      .order("position", { ascending: false })
      .limit(1);

    if (existingError) {
      console.error(
        "Erro ao verificar exercícios existentes:",
        existingError,
      );

      alert(
        "Não foi possível adicionar o exercício.",
      );

      setSaving(false);
      return;
    }

    const nextPosition =
      existingExercises &&
      existingExercises.length > 0
        ? existingExercises[0].position + 1
        : 0;

    const { error } = await supabase
      .from("workout_exercises")
      .insert({
        workout_id: workoutId,
        exercise_id: selectedExerciseId,
        position: nextPosition,
        sets: Number(sets),
        repetitions: Number(repetitions),
        rest_seconds:
          totalRestSeconds > 0
            ? totalRestSeconds
            : null,
      });

    if (error) {
      console.error(
        "Erro ao adicionar exercício:",
        error,
      );

      alert(
        "Não foi possível adicionar o exercício.",
      );

      setSaving(false);
      return;
    }

    setSelectedExerciseId("");
    setSets("");
    setRepetitions("");
    setRestMinutes("");
    setRestSeconds("");

    setSaving(false);
    setOpen(false);

    onExerciseAdded?.();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button className="rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
            + Adicionar exercício
          </Button>
        }
      />

      <DialogContent className="border-border bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Adicionar exercício
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="exercise"
              className="text-sm font-medium text-foreground"
            >
              Exercício
            </label>

            <select
              id="exercise"
              value={selectedExerciseId}
              onChange={(event) =>
                setSelectedExerciseId(
                  event.target.value,
                )
              }
              disabled={
                loadingExercises || saving
              }
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="">
                {loadingExercises
                  ? "Carregando exercícios..."
                  : "Selecione o exercício"}
              </option>

              {exercises.map((exercise) => (
                <option
                  key={exercise.id}
                  value={exercise.id}
                >
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="sets"
              className="text-sm font-medium text-foreground"
            >
              Séries
            </label>

            <Input
              id="sets"
              type="number"
              min="1"
              value={sets}
              onChange={(event) =>
                setSets(event.target.value)
              }
              disabled={saving}
              className="border-border bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="repetitions"
              className="text-sm font-medium text-foreground"
            >
              Repetições
            </label>

            <Input
              id="repetitions"
              type="number"
              min="1"
              value={repetitions}
              onChange={(event) =>
                setRepetitions(
                  event.target.value,
                )
              }
              disabled={saving}
              className="border-border bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Descanso
            </label>

            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={restMinutes}
                  onChange={(event) =>
                    setRestMinutes(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                  className="border-border bg-background text-foreground"
                />

                <span className="text-sm text-muted-foreground">
                  min
                </span>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={restSeconds}
                  onChange={(event) =>
                    setRestSeconds(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                  className="border-border bg-background text-foreground"
                />

                <span className="text-sm text-muted-foreground">
                  seg
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddExercise}
            disabled={saving}
            className="w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {saving
              ? "Salvando..."
              : "Adicionar exercício"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}