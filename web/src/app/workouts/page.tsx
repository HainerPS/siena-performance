import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function WorkoutsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Treinos
        </h1>

        <p className="text-muted-foreground">
          Crie e organize os treinos.
        </p>
      </div>
    </DashboardLayout>
  );
}