import Link from "next/link";

import { AppCard } from "@/components/ui/app-card";

type WorkoutCardProps = {
  id: string;
  name: string;
  description: string;
  studentName: string;
  exercises: number;
};

export function WorkoutCard({
  id,
  name,
  description,
  studentName,
  exercises,
}: WorkoutCardProps) {
  return (
    <Link href={`/workouts/${id}`} className="block">
      <AppCard>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {name}
            </h3>

            <p className="mt-1 text-sm font-medium text-primary">
              {studentName}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {description}
            </p>

            <p className="text-sm font-medium text-primary">
              {exercises}{" "}
              {exercises === 1 ? "exercício" : "exercícios"}
            </p>
          </div>
        </div>
      </AppCard>
    </Link>
  );
}