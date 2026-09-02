import { AppCard } from "@/components/ui/app-card";

type ProgressCardProps = {
  student: string;
  exercise: string;
};

export function ProgressCard({
  student,
  exercise,
}: ProgressCardProps) {
  return (
    <AppCard>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {student}
        </h3>

        <p className="text-sm text-muted-foreground">
          Exercício: {exercise}
        </p>
      </div>
    </AppCard>
  );
}