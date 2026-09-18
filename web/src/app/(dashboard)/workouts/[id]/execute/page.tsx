"use client";

import { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

interface Workout {
  id: string;
  name: string;
  description: string | null;
  student_id: string;
  student: {
    name: string;
  } | { name: string }[] | null;
}

interface WorkoutExercise {
  id: string;
  position: number;
  sets: number | null;
  repetitions: number | null;
  rest_seconds: number | null;
  exercise: {
    name: string;
  } | { name: string }[] | null;
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

export default function ExecuteWorkoutPage() {
  const params = useParams();
  const workoutId = params.id as string;

  const [workout, setWorkout] =
    useState<Workout | null>(null);

  const [workoutExercises, setWorkoutExercises] =
    useState<WorkoutExercise[]>([]);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [weights, setWeights] = useState<
    Record<string, string>
  >({});

  const [completedExercises, setCompletedExercises] =
    useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);

  const [startingWorkout, setStartingWorkout] =
    useState(false);

  const [savingExerciseId, setSavingExerciseId] =
    useState<string | null>(null);

  const [finishingWorkout, setFinishingWorkout] =
    useState(false);

  const [workoutFinished, setWorkoutFinished] =
    useState(false);

  const loadWorkout = useCallback(async () => {
    const supabase = createClient();

    const {
      data: workoutData,
      error: workoutError,
    } = await supabase
      .from("workouts")
      .select(`
        id,
        name,
        description,
        student_id,
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

    const {
      data: exercisesData,
      error: exercisesError,
    } = await supabase
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

  async function createWorkoutSession(
    studentId: string,
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({
        workout_id: workoutId,
        student_id: studentId,
      })
      .select("id")
      .single();

    if (error) {
      console.error(
        "Erro ao criar sessão do treino:",
        error,
      );

      return null;
    }

    console.log("Sessão criada:", data.id);

    return data.id;
  }

  async function handleStartWorkout() {
    if (!workout) {
      return;
    }

    if (sessionId) {
      return;
    }

    setStartingWorkout(true);

    const newSessionId =
      await createWorkoutSession(
        workout.student_id,
      );

    if (!newSessionId) {
      alert(
        "Não foi possível iniciar o treino.",
      );

      setStartingWorkout(false);
      return;
    }

    setSessionId(newSessionId);
    setStartingWorkout(false);
  }

  async function handleCompleteExercise(
    workoutExerciseId: string,
  ) {
    if (!sessionId) {
      alert(
        "Você precisa começar o treino primeiro.",
      );

      return;
    }

    const weightValue =
      weights[workoutExerciseId];

    const maxWeight =
      weightValue && weightValue.trim() !== ""
        ? Number(weightValue)
        : null;

    if (
      maxWeight !== null &&
      (Number.isNaN(maxWeight) || maxWeight < 0)
    ) {
      alert("Informe uma carga válida.");

      return;
    }

    setSavingExerciseId(workoutExerciseId);

    const supabase = createClient();

    const {
      data: existingResult,
      error: findError,
    } = await supabase
      .from("workout_exercise_results")
      .select("id")
      .eq("session_id", sessionId)
      .eq(
        "workout_exercise_id",
        workoutExerciseId,
      )
      .maybeSingle();

    if (findError) {
      console.error(
        "Erro ao verificar resultado existente:",
        findError,
      );

      alert(
        "Não foi possível salvar o exercício.",
      );

      setSavingExerciseId(null);

      return;
    }

    if (existingResult) {
      const { error: updateError } =
        await supabase
          .from("workout_exercise_results")
          .update({
            max_weight: maxWeight,
            completed: true,
          })
          .eq("id", existingResult.id);

      if (updateError) {
        console.error(
          "Erro ao atualizar carga:",
          updateError,
        );

        alert(
          "Não foi possível atualizar a carga.",
        );

        setSavingExerciseId(null);

        return;
      }
    } else {
      const { error: insertError } =
        await supabase
          .from("workout_exercise_results")
          .insert({
            session_id: sessionId,
            workout_exercise_id:
              workoutExerciseId,
            max_weight: maxWeight,
            completed: true,
          });

      if (insertError) {
        console.error(
          "Erro ao salvar exercício concluído:",
          insertError,
        );

        alert(
          "Não foi possível salvar o exercício.",
        );

        setSavingExerciseId(null);

        return;
      }
    }

    setCompletedExercises((current) => ({
      ...current,
      [workoutExerciseId]: true,
    }));

    setSavingExerciseId(null);
  }

  async function handleFinishWorkout() {
    if (!sessionId) {
      alert(
        "Você precisa começar o treino primeiro.",
      );

      return;
    }

    const totalExercises =
      workoutExercises.length;

    const completedCount =
      workoutExercises.filter(
        (exercise) =>
          completedExercises[exercise.id] === true,
      ).length;

    const pendingCount =
      totalExercises - completedCount;

    if (pendingCount > 0) {
      alert(
        `Você ainda precisa concluir ${pendingCount} ${
          pendingCount === 1
            ? "exercício"
            : "exercícios"
        }.`,
      );

      return;
    }

    setFinishingWorkout(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("workout_sessions")
      .update({
        completed_at:
          new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      console.error(
        "Erro ao finalizar treino:",
        error,
      );

      alert(
        "Não foi possível finalizar o treino.",
      );

      setFinishingWorkout(false);

      return;
    }

    setFinishingWorkout(false);
    setWorkoutFinished(true);

    alert("Treino finalizado com sucesso!");
  }

  useEffect(() => {
    if (workoutId) {
      loadWorkout();
    }
  }, [workoutId, loadWorkout]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">
          Carregando treino...
        </p>
      </div>
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

  const studentName = Array.isArray(workout.student)
    ? workout.student[0]?.name ?? "Aluno não encontrado"
    : workout.student?.name ?? "Aluno não encontrado";

  const workoutStarted = !!sessionId;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {workout.name}
        </h1>

        <p className="text-sm font-medium text-primary">
          {studentName}
        </p>

        {workout.description && (
          <p className="text-sm text-muted-foreground">
            {workout.description}
          </p>
        )}
      </div>

      {!workoutStarted && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Pronto para começar?
            </h2>

            <p className="text-sm text-muted-foreground">
              Revise os exercícios abaixo e clique em
              "Começar treino" quando estiver pronto.
            </p>

            <button
              type="button"
              onClick={handleStartWorkout}
              disabled={startingWorkout}
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingWorkout
                ? "Iniciando..."
                : "Começar treino"}
            </button>
          </div>
        </div>
      )}

      {workoutStarted && !workoutFinished && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm font-medium text-primary">
            Treino em andamento
          </p>
        </div>
      )}

      <div className="space-y-4">
        {workoutExercises.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Nenhum exercício foi adicionado a este
              treino.
            </p>
          </div>
        ) : (
          workoutExercises.map(
            (workoutExercise, index) => {
              const isCompleted =
                completedExercises[
                  workoutExercise.id
                ] ?? false;

              const isSaving =
                savingExerciseId ===
                workoutExercise.id;

              return (
                <div
                  key={workoutExercise.id}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Exercício {index + 1}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold text-foreground">
                        {Array.isArray(workoutExercise.exercise)
                          ? workoutExercise.exercise[0]?.name ??
                            "Exercício não encontrado"
                          : workoutExercise.exercise?.name ??
                            "Exercício não encontrado"}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        Séries
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {workoutExercise.sets ??
                          "-"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        Repetições
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {workoutExercise.repetitions ??
                          "-"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        Descanso
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {formatRest(
                          workoutExercise.rest_seconds,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor={`weight-${workoutExercise.id}`}
                      className="text-sm font-medium text-foreground"
                    >
                      Maior carga utilizada
                    </label>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id={`weight-${workoutExercise.id}`}
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        value={
                          weights[
                            workoutExercise.id
                          ] ?? ""
                        }
                        onChange={(event) =>
                          setWeights(
                            (current) => ({
                              ...current,
                              [workoutExercise.id]:
                                event.target.value,
                            }),
                          )
                        }
                        disabled={
                          !workoutStarted ||
                          isSaving ||
                          finishingWorkout ||
                          workoutFinished
                        }
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <span className="text-sm text-muted-foreground">
                        kg
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCompleteExercise(
                        workoutExercise.id,
                      )
                    }
                    disabled={
                      !workoutStarted ||
                      isSaving ||
                      finishingWorkout ||
                      workoutFinished
                    }
                    className="mt-5 w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving
                      ? "Salvando..."
                      : isCompleted
                        ? "Atualizar carga"
                        : "Marcar como concluído"}
                  </button>
                </div>
              );
            },
          )
        )}
      </div>

      {workoutStarted &&
        workoutExercises.length > 0 &&
        !workoutFinished && (
          <button
            type="button"
            onClick={handleFinishWorkout}
            disabled={finishingWorkout}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {finishingWorkout
              ? "Finalizando..."
              : "Finalizar treino"}
          </button>
        )}

      {workoutFinished && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-lg font-semibold text-primary">
            Treino concluído
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Este treino foi finalizado com sucesso.
          </p>
        </div>
      )}
    </div>
  );
}