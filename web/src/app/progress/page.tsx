import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ProgressPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Evolução
        </h1>

        <p className="text-muted-foreground">
          Acompanhe a evolução dos alunos.
        </p>
      </div>
    </DashboardLayout>
  );
}