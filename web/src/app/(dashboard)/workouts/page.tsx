import { WorkoutsList } from "@/components/workouts/workouts-list";
import { NewWorkoutDialog } from "@/components/workouts/new-workout-dialog";

export default function WorkoutsPage() {
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

        <NewWorkoutDialog />
      </div>

      <WorkoutsList />
    </div>
  );
}