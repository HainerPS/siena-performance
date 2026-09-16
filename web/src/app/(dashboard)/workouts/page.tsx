"use client";

import { useState } from "react";

import { NewWorkoutDialog } from "@/components/workouts/new-workout-dialog";
import { WorkoutsList } from "@/components/workouts/workouts-list";

export default function WorkoutsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleWorkoutCreated() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Treinos
          </h1>

          <p className="mt-2 text-muted-foreground">
            Gerencie os treinos cadastrados.
          </p>
        </div>

        <NewWorkoutDialog
          onWorkoutCreated={handleWorkoutCreated}
        />
      </div>

      <WorkoutsList refreshKey={refreshKey} />
    </div>
  );
}