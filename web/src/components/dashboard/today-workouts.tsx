import { AppCard } from "@/components/ui/app-card";

import { todayWorkouts } from "@/data/workouts";

export function TodayWorkouts() {
  return (
    <AppCard>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Treinos de hoje
        </h3>

        <div className="space-y-4">
          {todayWorkouts.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-border bg-muted p-4"
            >
              <div>
                <p className="font-medium text-foreground">
                  {item.student}
                </p>

                <p className="text-sm text-muted-foreground">
                  {item.workout}
                </p>
              </div>

              <span className="text-sm font-semibold text-primary">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppCard>
  );
}