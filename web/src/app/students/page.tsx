import { NewStudentDialog } from "@/components/students/new-student-dialog";
import { StudentsList } from "@/components/students/students-list";


export default function StudentsPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Alunos
          </h1>

          <p className="text-muted-foreground">
            Gerencie seus alunos cadastrados.
          </p>
        </div>

        <NewStudentDialog />

      </div>

      <StudentsList />

    </div>
  );
}