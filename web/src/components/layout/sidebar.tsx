"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Alunos",
    href: "/students",
    icon: Users,
  },
  {
    title: "Treinos",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    title: "Evolução",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    title: "Agenda",
    href: "/schedule",
    icon: CalendarDays,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 border-r bg-background p-6 md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold">
          Siena Performance
        </h2>

        <p className="text-sm text-muted-foreground">
          Gestão de treinos
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon size={20} />

              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}