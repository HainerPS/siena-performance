import { AppCard } from "@/components/ui/app-card";

type WorkoutCardProps = {
  name: string;
  description: string;
  exercises: number;
};

export function WorkoutCard({
  name,
  description,
  exercises,
}: WorkoutCardProps) {
  return (
    <AppCard>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {name}
        </h3>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>

          <p className="text-sm font-medium text-primary">
            {exercises} exercícios
          </p>
        </div>
      </div>
    </AppCard>
  );
}