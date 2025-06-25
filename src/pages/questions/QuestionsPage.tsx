import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuestionStore } from "@/lib/store/useQuestionStore";

export default function QuestionsPage() {
  const { getQuestions, loading } = useQuestionStore();

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <p className="text-muted-foreground">
          Manage and create questions for language learning exercises and assessments.
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Questions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain the questions management interface. Coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 