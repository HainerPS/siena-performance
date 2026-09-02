import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppCard } from "@/components/ui/app-card";

import { students } from "@/data/students";

export function RecentStudents() {
  return (
    <AppCard>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Últimos alunos
        </h3>

        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium text-foreground">
                    {student.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {student.goal}
                  </p>
                </div>
              </div>

              <span className="text-sm text-muted-foreground">
                {student.workout}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppCard>
  );
}