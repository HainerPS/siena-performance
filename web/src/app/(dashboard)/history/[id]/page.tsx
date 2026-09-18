"use client";

import { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { AppCard } from "@/components/ui/app-card";

import { createClient } from "@/lib/supabase/client";

interface NamedRelation {
  name: string;
}

interface WorkoutSession {
  id: string;
  started_at: string;
  completed_at: string | null;
  workout: NamedRelation | null;
  student: NamedRelation | null;
}

interface WorkoutExercise {
  id: string;
  position: number;
  sets: number | null;
  repetitions: number | null;
  rest_seconds: number | null;
  exercise: NamedRelation | null;
}

interface WorkoutExerciseResult {
  id: string;
  max_weight: number | null;
  completed: boolean;
  workout_exercise: WorkoutExercise | null;
}

function asNamedRelation(
  value: NamedRelation | NamedRelation[] | null,
): NamedRelation | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function asWorkoutExercise(
  value:
    | WorkoutExercise
    | WorkoutExercise[]
    | null,
): WorkoutExercise | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function formatSessionDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
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

export default function SessionDetailsPage() {
  const params = useParams();

  const sessionId = params.id as string;

  const [session, setSession] =
    useState<WorkoutSession | null>(null);

  const [exerciseResults, setExerciseResults] =
    useState<WorkoutExerciseResult[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [exercisesError, setExercisesError] =
    useState<string | null>(null);

  const loadSession = useCallback(async () => {
    const supabase = createClient();

    const {
      data,
      error: queryError,
    } = await supabase
      .from("workout_sessions")
      .select(`
        id,
        started_at,
        completed_at,
        workout:workouts (
          name
        ),
        student:students (
          name
        )
      `)
      .eq("id", sessionId)
      .single();

    if (queryError) {
      console.error(
        "Erro ao carregar sessão:",
        queryError,
      );

      if (queryError.code === "PGRST116") {
        setSession(null);
        setError(null);
      } else {
        setSession(null);
        setError(
          "Não foi possível carregar os detalhes da sessão.",
        );
      }

      setLoading(false);

      return;
    }

    setError(null);

    setSession({
      id: data.id,
      started_at: data.started_at,
      completed_at: data.completed_at,
      workout: asNamedRelation(data.workout),
      student: asNamedRelation(data.student),
    });

    const {
      data: resultsData,
      error: resultsError,
    } = await supabase
      .from("workout_exercise_results")
      .select(`
        id,
        max_weight,
        completed,
        workout_exercise:workout_exercises (
          id,
          position,
          sets,
          repetitions,
          rest_seconds,
          exercise:exercises (
            name
          )
        )
      `)
      .eq("session_id", sessionId);

    if (resultsError) {
      console.error(
        "Erro ao carregar exercícios da sessão:",
        resultsError,
      );

      setExerciseResults([]);
      setExercisesError(
        "Não foi possível carregar os exercícios desta sessão.",
      );
    } else {
      setExercisesError(null);

      const normalizedResults =
        (resultsData ?? []).map((result) => ({
          id: result.id,
          max_weight: result.max_weight,
          completed: result.completed,
          workout_exercise:
            asWorkoutExercise(
              result.workout_exercise,
            ),
        }));

      normalizedResults.sort(
        (a, b) =>
          (a.workout_exercise?.position ?? 0) -
          (b.workout_exercise?.position ?? 0),
      );

      setExerciseResults(normalizedResults);
    }

    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId, loadSession]);

  if (loading) {
    return (
      <p className="text-muted-foreground">
        Carregando sessão...
      </p>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Detalhes da sessão
        </h1>

        <p className="text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sessão não encontrada
        </h1>

        <p className="text-muted-foreground">
          Não foi possível encontrar esta sessão.
        </p>
      </div>
    );
  }

  const isCompleted =
    session.completed_at !== null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Detalhes da sessão
        </h1>

        <p className="mt-2 text-muted-foreground">
          Veja as informações deste treino realizado.
        </p>
      </div>

      <AppCard>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {session.workout?.name ??
                "Treino não encontrado"}
            </h2>

            <p className="mt-1 text-sm font-medium text-primary">
              {session.student?.name ??
                "Aluno não encontrado"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Início:{" "}
              {formatSessionDate(
                session.started_at,
              )}
            </p>

            {session.completed_at ? (
              <p className="text-sm text-muted-foreground">
                Conclusão:{" "}
                {formatSessionDate(
                  session.completed_at,
                )}
              </p>
            ) : null}

            <p className="text-sm font-medium text-primary">
              {isCompleted
                ? "Concluído"
                : "Em andamento"}
            </p>
          </div>
        </div>
      </AppCard>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Exercícios
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Resultados registrados nesta sessão.
          </p>
        </div>

        {exercisesError ? (
          <AppCard>
            <p className="text-sm text-muted-foreground">
              {exercisesError}
            </p>
          </AppCard>
        ) : exerciseResults.length === 0 ? (
          <AppCard>
            <p className="text-sm text-muted-foreground">
              Nenhum exercício foi registrado nesta
              sessão.
            </p>
          </AppCard>
        ) : (
          <div className="space-y-4">
            {exerciseResults.map(
              (result, index) => {
                const exercise =
                  result.workout_exercise;

                return (
                  <AppCard key={result.id}>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Exercício {index + 1}
                        </p>

                        <h3 className="mt-1 text-xl font-semibold text-foreground">
                          {exercise?.exercise
                            ?.name ??
                            "Exercício não encontrado"}
                        </h3>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border bg-background p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            Séries
                          </p>

                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {exercise?.sets ??
                              "-"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-border bg-background p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            Repetições
                          </p>

                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {exercise?.repetitions ??
                              "-"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-border bg-background p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            Descanso
                          </p>

                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {formatRest(
                              exercise?.rest_seconds ??
                                null,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Maior carga utilizada
                          </p>

                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {result.max_weight !==
                            null
                              ? `${result.max_weight} kg`
                              : "Não informado"}
                          </p>
                        </div>

                        <p
                          className={`text-sm font-semibold ${
                            result.completed
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {result.completed
                            ? "✓ Concluído"
                            : "Não concluído"}
                        </p>
                      </div>
                    </div>
                  </AppCard>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}