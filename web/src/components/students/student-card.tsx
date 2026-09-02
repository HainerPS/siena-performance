import { AppCard } from "@/components/ui/app-card";
import { EditStudentDialog } from "./edit-student-dialog";

type StudentCardProps = {
  id: string;
  name: string;
  goal: string;
  status: string;
  onStudentUpdated?: () => void;
};

export function StudentCard({
  id,
  name,
  goal,
  status,
  onStudentUpdated,
}: StudentCardProps) {
  return (
    <AppCard>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {name}
        </h3>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Objetivo: {goal}
          </p>

          <p className="text-sm font-medium text-primary">
            Status: {status}
          </p>
        </div>

        <EditStudentDialog
          studentId={id}
          initialName={name}
          initialGoal={goal}
          initialStatus={status}
          onStudentUpdated={onStudentUpdated}
        />
      </div>
    </AppCard>
  );
}