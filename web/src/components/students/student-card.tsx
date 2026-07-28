import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  type StudentCardProps = {
    name: string;
    goal: string;
    status: string;
  };
  
  export function StudentCard({
    name,
    goal,
    status,
  }: StudentCardProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {name}
          </CardTitle>
        </CardHeader>
  
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Objetivo: {goal}
          </p>
  
          <p className="text-sm">
            Status: {status}
          </p>
        </CardContent>
      </Card>
    );
  }