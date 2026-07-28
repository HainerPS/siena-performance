import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function SchedulePage() {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Agenda
        </h1>

        <p className="text-muted-foreground">
          Visualize os compromissos do dia.
        </p>
      </div>
    </DashboardLayout>
  );
}