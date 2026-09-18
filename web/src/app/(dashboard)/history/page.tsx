"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

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

function formatSessionDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    const supabase = createClient();

    const { data, error: queryError } = await supabase
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
      .order("started_at", { ascending: false });

    if (queryError) {
      console.error("Erro ao carregar histórico:", queryError);
      setError("Não foi possível carregar o histórico.");
      setSessions([]);
      setLoading(false);
      return;
    }

    setError(null);
    setSessions(
      (data ?? []).map((session) => ({
        id: session.id,
        started_at: session.started_at,
        completed_at: session.completed_at,
        workout: asNamedRelation(session.workout),
        student: asNamedRelation(session.student),
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Histórico
        </h1>

        <p className="mt-2 text-muted-foreground">
          Veja os treinos realizados pelos seus alunos.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">
          Carregando histórico...
        </p>
      ) : error ? (
        <p className="text-muted-foreground">
          {error}
        </p>
      ) : sessions.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum histórico encontrado.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => {
            const isCompleted = session.completed_at !== null;

            return (
              <Link
                key={session.id}
                href={`/history/${session.id}`}
                className="block"
              >
                <AppCard>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {session.workout?.name ?? "Treino não encontrado"}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-primary">
                        {session.student?.name ?? "Aluno não encontrado"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {formatSessionDate(session.started_at)}
                      </p>

                      <p className="text-sm font-medium text-primary">
                        {isCompleted ? "Concluído" : "Em andamento"}
                      </p>
                    </div>
                  </div>
                </AppCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
