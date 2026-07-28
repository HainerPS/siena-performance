import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Alunos
        </h1>

        <p className="text-muted-foreground">
          Gerencie todos os alunos cadastrados.
        </p>
      </div>
    </DashboardLayout>
  );
}