"use client";

import { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { AddExerciseDialog } from "@/components/workouts/add-exercise-dialog";
import { DeleteExerciseButton } from "@/components/workouts/delete-exercise-button";
import { EditExerciseDialog } from "@/components/workouts/edit-exercise-dialog";

import { createClient } from "@/lib/supabase/client";

interface Workout {
  id: string;
  name: string;
  description: string | null;
  student: {
    name: string;
  } | null;
}

interface WorkoutExercise {
  id: string;
  position: number;
  sets: number | null;
  repetitions: number | null;
  rest_seconds: number | null;
  exercise: {
    name: string;
  } | null;
}

function formatRest(seconds: number | null) {
  if (seconds === null) {
    return "-";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds}s`;
}

export default function WorkoutPage() {
  const params = useParams();
  const workoutId = params.id as string;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<
    WorkoutExercise[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadWorkout = useCallback(async () => {
    const supabase = createClient();

    const { data: workoutData, error: workoutError } =
      await supabase
        .from("workouts")
        .select(`
          id,
          name,
          description,
          student:students (
            name
          )
        `)
        .eq("id", workoutId)
        .single();

    if (workoutError) {
      console.error(
        "Erro ao carregar treino:",
        workoutError,
      );

      setLoading(false);
      return;
    }

    const { data: exercisesData, error: exercisesError } =
      await supabase
        .from("workout_exercises")
        .select(`
          id,
          position,
          sets,
          repetitions,
          rest_seconds,
          exercise:exercises (
            name
          )
        `)
        .eq("workout_id", workoutId)
        .order("position", { ascending: true });

    if (exercisesError) {
      console.error(
        "Erro ao carregar exercícios:",
        exercisesError,
      );

      setLoading(false);
      return;
    }

    setWorkout(workoutData);
    setWorkoutExercises(exercisesData ?? []);
    setLoading(false);
  }, [workoutId]);

  useEffect(() => {
    if (workoutId) {
      loadWorkout();
    }
  }, [workoutId, loadWorkout]);

  if (loading) {
    return (
      <p className="text-muted-foreground">
        Carregando treino...
      </p>
    );
  }

  if (!workout) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Treino não encontrado
        </h1>

        <p className="text-muted-foreground">
          Não foi possível encontrar este treino.
        </p>
      </div>
    );
  }

  const studentName =
    workout.student?.name ?? "Aluno não encontrado";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {workout.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {workout.description ?? "Sem descrição"}
        </p>

        <p className="mt-2 text-sm font-medium text-primary">
          Aluno: {studentName}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            Exercícios
          </h2>

          <AddExerciseDialog
            workoutId={workoutId}
            onExerciseAdded={loadWorkout}
          />
        </div>

        {workoutExercises.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhum exercício adicionado ainda.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {workoutExercises.map((workoutExercise) => (
              <div
                key={workoutExercise.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {workoutExercise.exercise?.name ??
                        "Exercício não encontrado"}
                    </h3>

                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          Séries
                        </p>

                        <p className="mt-1 font-semibold text-foreground">
                          {workoutExercise.sets ?? "-"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          Repetições
                        </p>

                        <p className="mt-1 font-semibold text-foreground">
                          {workoutExercise.repetitions ?? "-"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          Descanso
                        </p>

                        <p className="mt-1 font-semibold text-foreground">
                          {formatRest(
                            workoutExercise.rest_seconds,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <EditExerciseDialog
                      workoutExerciseId={workoutExercise.id}
                      initialSets={workoutExercise.sets}
                      initialRepetitions={
                        workoutExercise.repetitions
                      }
                      initialRestSeconds={
                        workoutExercise.rest_seconds
                      }
                      onExerciseUpdated={loadWorkout}
                    />

                    <DeleteExerciseButton
                      workoutExerciseId={workoutExercise.id}
                      onDeleted={loadWorkout}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}