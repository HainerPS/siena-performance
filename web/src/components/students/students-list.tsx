"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { students } from "@/data/students";
import { StudentCard } from "./student-card";

export function StudentsList() {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <Input
        placeholder="Buscar aluno..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            name={student.name}
            goal={student.goal}
            status={student.status}
          />
        ))}

      </div>

    </div>
  );
}