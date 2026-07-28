import { Users, Dumbbell, CalendarDays, TrendingUp } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RecentStudents } from "@/components/dashboard/recent-students";
import { TodayWorkouts } from "@/components/dashboard/today-workouts";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Acompanhe seus alunos e treinos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Alunos"
            value="32"
            icon={<Users size={28} />}
          />

          <StatsCard
            title="Treinos"
            value="18"
            icon={<Dumbbell size={28} />}
          />

          <StatsCard
            title="Treinos Hoje"
            value="7"
            icon={<CalendarDays size={28} />}
          />

          <StatsCard
            title="Evolução"
            value="+12%"
            icon={<TrendingUp size={28} />}
          />
        </div>
        <RecentStudents />

        <TodayWorkouts />

      </div>
    </DashboardLayout>
  );
}