import { workouts } from "@/data/workouts";
import { WorkoutCard } from "./workout-card";

export function WorkoutsList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          name={workout.name}
          description={workout.description}
          exercises={workout.exercises}
        />
      ))}
    </div>
  );
}