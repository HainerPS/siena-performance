import {
  Users,
  Dumbbell,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentStudents } from "@/components/dashboard/recent-students";
import { TodayWorkouts } from "@/components/dashboard/today-workouts";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gerencie seus alunos, treinos e acompanhe a evolução.
        </p>
      </div>

      {/* Indicadores */}
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

      {/* Atividade */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentStudents />

        <TodayWorkouts />
      </div>
    </div>
  );
}