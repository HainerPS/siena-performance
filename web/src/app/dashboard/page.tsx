import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Acompanhe seus alunos e treinos.
        </p>
      </div>
    </DashboardLayout>
  );
}