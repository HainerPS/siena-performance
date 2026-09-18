"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { createClient } from "@/lib/supabase/client";

interface Student {
  id: string;
  name: string;
}

interface Exercise {
  id: string;
  name: string;
}

interface ProgressPoint {
  sessionId: string;
  startedAt: string;
  maxWeight: number;
}

interface ChartPoint {
  date: string;
  fullDate: string;
  maxWeight: number;
}

export function ProgressList() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  const [selectedExerciseId, setSelectedExerciseId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [progressData, setProgressData] =
    useState<ProgressPoint[]>([]);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  const [progressError, setProgressError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadFilters() {
      const supabase = createClient();

      const [
        {
          data: studentsData,
          error: studentsError,
        },
        {
          data: exercisesData,
          error: exercisesError,
        },
      ] = await Promise.all([
        supabase
          .from("students")
          .select("id, name")
          .order("name", {
            ascending: true,
          }),

        supabase
          .from("exercises")
          .select("id, name")
          .order("name", {
            ascending: true,
          }),
      ]);

      if (studentsError) {
        console.error(
          "Erro ao carregar alunos:",
          studentsError,
        );
      }

      if (exercisesError) {
        console.error(
          "Erro ao carregar exercícios:",
          exercisesError,
        );
      }

      setStudents(studentsData ?? []);
      setExercises(exercisesData ?? []);

      setLoading(false);
    }

    loadFilters();
  }, []);

  async function loadProgress(
    studentId: string,
    exerciseId: string,
  ) {
    setLoadingProgress(true);
    setProgressError(null);
    setProgressData([]);

    const supabase = createClient();

    const {
      data,
      error,
    } = await supabase
      .from("workout_exercise_results")
      .select(`
        id,
        max_weight,
        workout_exercise:workout_exercises!inner (
          exercise_id
        ),
        session:workout_sessions!inner (
          id,
          student_id,
          started_at
        )
      `)
      .eq(
        "workout_exercise.exercise_id",
        exerciseId,
      )
      .eq(
        "session.student_id",
        studentId,
      )
      .not("max_weight", "is", null)
      .order("started_at", {
        referencedTable: "session",
        ascending: true,
      });

    if (error) {
      console.error(
        "Erro ao carregar evolução:",
        error,
      );

      setProgressError(
        "Não foi possível carregar a evolução.",
      );

      setLoadingProgress(false);
      return;
    }

    const points: ProgressPoint[] =
      (data ?? [])
        .map((item) => {
          const session = Array.isArray(
            item.session,
          )
            ? item.session[0]
            : item.session;

          if (
            !session ||
            item.max_weight === null
          ) {
            return null;
          }

          return {
            sessionId: session.id,
            startedAt: session.started_at,
            maxWeight: item.max_weight,
          };
        })
        .filter(
          (
            point,
          ): point is ProgressPoint =>
            point !== null,
        );

    setProgressData(points);
    setLoadingProgress(false);
  }

  useEffect(() => {
    if (
      !selectedStudentId ||
      !selectedExerciseId
    ) {
      setProgressData([]);
      setProgressError(null);
      return;
    }

    loadProgress(
      selectedStudentId,
      selectedExerciseId,
    );
  }, [
    selectedStudentId,
    selectedExerciseId,
  ]);

  const selectedExercise =
    exercises.find(
      (exercise) =>
        exercise.id ===
        selectedExerciseId,
    );

  const chartData: ChartPoint[] =
    progressData.map((point) => ({
      date: new Date(
        point.startedAt,
      ).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      fullDate: new Date(
        point.startedAt,
      ).toLocaleDateString("pt-BR"),
      maxWeight: point.maxWeight,
    }));

  const currentMaxWeight =
    progressData.length > 0
      ? progressData[
          progressData.length - 1
        ].maxWeight
      : null;

  const firstWeight =
    progressData.length > 0
      ? progressData[0].maxWeight
      : null;

  const difference =
    currentMaxWeight !== null &&
    firstWeight !== null
      ? currentMaxWeight - firstWeight
      : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="progress-student"
              className="text-sm font-medium text-foreground"
            >
              Aluno
            </label>

            <select
              id="progress-student"
              value={selectedStudentId}
              onChange={(event) =>
                setSelectedStudentId(
                  event.target.value,
                )
              }
              disabled={loading}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="">
                {loading
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
          </div>

          <div className="space-y-2">
            <label
              htmlFor="progress-exercise"
              className="text-sm font-medium text-foreground"
            >
              Exercício
            </label>

            <select
              id="progress-exercise"
              value={selectedExerciseId}
              onChange={(event) =>
                setSelectedExerciseId(
                  event.target.value,
                )
              }
              disabled={loading}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="">
                {loading
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
        </div>
      </div>

      {loadingProgress && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Carregando evolução...
          </p>
        </div>
      )}

      {progressError && (
        <div className="rounded-2xl border border-destructive/20 bg-card p-6">
          <p className="text-sm text-destructive">
            {progressError}
          </p>
        </div>
      )}

      {!loadingProgress &&
        !progressError &&
        selectedStudentId &&
        selectedExerciseId &&
        progressData.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Nenhum registro de carga encontrado
              para este aluno e exercício.
            </p>
          </div>
        )}

      {!loadingProgress &&
        !progressError &&
        progressData.length > 0 && (
          <>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Evolução da carga
                </p>

                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {selectedExercise?.name ??
                    "Exercício"}
                </h2>
              </div>

              <div className="mt-6 h-80 w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />

                    <XAxis
                      dataKey="date"
                      dy={8}
                      tick={{
                        fill: "currentColor",
                        fontSize: 12,
                      }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />

                    <YAxis
                      dx={-4}
                      tick={{
                        fill: "currentColor",
                        fontSize: 12,
                      }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                      tickFormatter={(value) =>
                        `${value} kg`
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          "var(--card)",
                        borderColor:
                          "var(--border)",
                        borderRadius:
                          "12px",
                      }}
                      labelStyle={{
                        color:
                          "var(--foreground)",
                      }}
                      formatter={(value) => [
                        `${value} kg`,
                        "Maior carga",
                      ]}
                      labelFormatter={(
                        _label,
                        payload,
                      ) => {
                        const point =
                          payload?.[0]
                            ?.payload as
                            | ChartPoint
                            | undefined;

                        return (
                          point?.fullDate ??
                          ""
                        );
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="maxWeight"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "var(--primary)",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  Maior carga atual
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {currentMaxWeight !== null
                    ? `${currentMaxWeight} kg`
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  Primeiro registro
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {firstWeight !== null
                    ? `${firstWeight} kg`
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  Diferença
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {difference !== null
                    ? `${
                        difference > 0
                          ? "+"
                          : ""
                      }${difference} kg`
                    : "-"}
                </p>
              </div>
            </div>
          </>
        )}

      {!loading &&
        students.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Nenhum aluno cadastrado.
            </p>
          </div>
        )}

      {!loading &&
        exercises.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Nenhum exercício cadastrado.
            </p>
          </div>
        )}
    </div>
  );
}