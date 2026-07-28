import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Configurações
        </h1>

        <p className="text-muted-foreground">
          Personalize o sistema.
        </p>
      </div>
    </DashboardLayout>
  );
}