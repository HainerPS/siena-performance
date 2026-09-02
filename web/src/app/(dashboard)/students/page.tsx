"use client";

import { useState } from "react";

import { NewStudentDialog } from "@/components/students/new-student-dialog";
import { StudentsList } from "@/components/students/students-list";

export default function StudentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleStudentCreated() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Alunos
          </h1>

          <p className="mt-2 text-muted-foreground">
            Gerencie seus alunos cadastrados.
          </p>
        </div>

        <NewStudentDialog
          onStudentCreated={handleStudentCreated}
        />
      </div>

      <StudentsList refreshKey={refreshKey} />
    </div>
  );
}