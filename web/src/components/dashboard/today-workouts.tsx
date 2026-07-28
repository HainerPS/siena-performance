import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { todayWorkouts } from "@/data/workouts";

export function TodayWorkouts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Treinos de hoje
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {todayWorkouts.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">
                {item.student}
              </p>

              <p className="text-sm text-muted-foreground">
                {item.workout}
              </p>
            </div>

            <span className="text-sm font-semibold">
              {item.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}