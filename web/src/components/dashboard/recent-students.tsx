import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { students } from "@/data/students";

export function RecentStudents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos alunos</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{student.name}</p>

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
      </CardContent>
    </Card>
  );
}