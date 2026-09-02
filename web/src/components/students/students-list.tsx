"use client";

import { useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { createClient } from "@/lib/supabase/client";
import { StudentCard } from "./student-card";

interface Student {
  id: string;
  name: string;
  goal: string | null;
  status: string;
}

interface StudentsListProps {
  refreshKey: number;
}

export function StudentsList({ refreshKey }: StudentsListProps) {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("students")
      .select("id, name, goal, status")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar alunos:", error);
      setLoading(false);
      return;
    }

    setStudents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents, refreshKey]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Input
        placeholder="Buscar aluno..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 max-w-md rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
      />

      {loading ? (
        <p className="text-muted-foreground">
          Carregando alunos...
        </p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum aluno encontrado.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <StudentCard
            key={student.id}
            id={student.id}
            name={student.name}
            goal={student.goal ?? "Sem objetivo definido"}
            status={student.status}
            onStudentUpdated={loadStudents}
          />
          ))}
        </div>
      )}
    </div>
  );
}