import {
    Calendar,
    Dumbbell,
    LayoutDashboard,
    Settings,
    TrendingUp,
    Users,
  } from "lucide-react";
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Alunos",
      icon: Users,
    },
    {
      title: "Treinos",
      icon: Dumbbell,
    },
    {
      title: "Evolução",
      icon: TrendingUp,
    },
    {
      title: "Agenda",
      icon: Calendar,
    },
    {
      title: "Configurações",
      icon: Settings,
    },
  ];
  
  export function Sidebar() {
    return (
      <aside className="flex h-screen w-64 flex-col border-r bg-background p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">
            Siena Performance
          </h1>
          <p className="text-sm text-muted-foreground">
            Personal Trainer
          </p>
        </div>
  
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
  
            return (
              <button
                key={item.title}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Icon size={18} />
                {item.title}
              </button>
            );
          })}
        </nav>
      </aside>
    );
  }