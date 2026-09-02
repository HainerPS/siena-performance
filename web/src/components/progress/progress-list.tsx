import { progressData } from "@/data/progress";
import { ProgressCard } from "./progress-card";

export function ProgressList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {progressData.map((item) => (
        <ProgressCard
          key={item.id}
          student={item.student}
          exercise={item.exercise}
        />
      ))}
    </div>
  );
}