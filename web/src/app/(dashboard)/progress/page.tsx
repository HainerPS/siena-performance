import { ProgressList } from "@/components/progress/progress-list";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Evolução
        </h1>

        <p className="mt-2 text-muted-foreground">
          Acompanhe o progresso dos seus alunos.
        </p>
      </div>

      <ProgressList />
    </div>
  );
}