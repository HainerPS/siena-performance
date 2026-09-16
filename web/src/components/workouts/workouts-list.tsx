"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { WorkoutCard } from "./workout-card";

interface Workout {
  id: string;
  name: string;
  description: string | null;
  student_id: string;
  student: {
    name: string;
  } | null;
  workout_exercises: {
    id: string;
  }[];
}

interface WorkoutsListProps {
  refreshKey: number;
}

export function WorkoutsList({
  refreshKey,
}: WorkoutsListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("workouts")
      .select(`
        id,
        name,
        description,
        student_id,
        student:students (
          name
        ),
        workout_exercises (
          id
        )
      `)
      .order("created_at", { ascending: false });

    console.log("WORKOUTS DATA:", data);
    console.log("WORKOUTS ERROR:", error);

    if (error) {
      console.error(
        "Erro ao carregar treinos:",
        error,
      );
      setLoading(false);
      return;
    }

    setWorkouts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts, refreshKey]);

  if (loading) {
    return (
      <p className="text-muted-foreground">
        Carregando treinos...
      </p>
    );
  }

  if (workouts.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhum treino encontrado.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          id={workout.id}
          name={workout.name}
          description={workout.description ?? "Sem descrição"}
          studentName={
            workout.student?.name ?? "Aluno não encontrado"
          }
          exercises={workout.workout_exercises?.length ?? 0}
        />
      ))}
    </div>
  );
}