"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export function NewStudentDialog() {
  return (
    <Dialog>

      <DialogTrigger asChild>
        <Button>
          + Novo aluno
        </Button>
      </DialogTrigger>


      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Novo aluno
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4">

          <Input
            placeholder="Nome do aluno"
          />


          <Input
            placeholder="Objetivo (ex: Hipertrofia)"
          />


          <Button className="w-full">
            Salvar aluno
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}