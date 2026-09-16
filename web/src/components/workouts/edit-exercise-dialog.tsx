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

interface EditExerciseDialogProps {
  workoutExerciseId: string;
  initialSets: number | null;
  initialRepetitions: number | null;
  initialRestSeconds: number | null;
  onExerciseUpdated?: () => void;
}

export function EditExerciseDialog({
  workoutExerciseId,
  initialSets,
  initialRepetitions,
  initialRestSeconds,
  onExerciseUpdated,
}: EditExerciseDialogProps) {
  const [open, setOpen] = useState(false);

  const [sets, setSets] = useState(
    initialSets?.toString() ?? "",
  );

  const [repetitions, setRepetitions] = useState(
    initialRepetitions?.toString() ?? "",
  );

  const [restMinutes, setRestMinutes] = useState(
    initialRestSeconds !== null
      ? Math.floor(initialRestSeconds / 60).toString()
      : "",
  );

  const [restSeconds, setRestSeconds] = useState(
    initialRestSeconds !== null
      ? (initialRestSeconds % 60).toString()
      : "",
  );

  const [saving, setSaving] = useState(false);

  async function handleUpdate() {
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

    const { error } = await supabase
      .from("workout_exercises")
      .update({
        sets: Number(sets),
        repetitions: Number(repetitions),
        rest_seconds:
          totalRestSeconds > 0
            ? totalRestSeconds
            : null,
      })
      .eq("id", workoutExerciseId);

    if (error) {
      console.error(
        "Erro ao atualizar exercício:",
        error,
      );

      alert(
        "Não foi possível atualizar o exercício.",
      );

      setSaving(false);
      return;
    }

    setSaving(false);
    setOpen(false);
    onExerciseUpdated?.();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Editar
          </Button>
        }
      />

      <DialogContent className="border-border bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Editar exercício
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
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
                setRepetitions(event.target.value)
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
            onClick={handleUpdate}
            disabled={saving}
            className="w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {saving
              ? "Salvando..."
              : "Salvar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}