import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useExamAttempts } from "@/hooks/useExamAttempts";
import ExamResultsViewModal from "./ExamResultsViewModal";
import { toast } from "sonner";

interface ViewExamResultsButtonProps {
  attemptId: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  className?: string;
}

export default function ViewExamResultsButton({
  attemptId,
  variant = "outline",
  size = "sm",
  children,
  className,
}: ViewExamResultsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { getAttemptDetails } = useExamAttempts();

  const handleViewResults = async () => {
    setLoading(true);
    try {
      const attemptDetails = await getAttemptDetails(attemptId);
      if (attemptDetails) {
        setResult(attemptDetails);
        setIsModalOpen(true);
      } else {
        toast.error("No se pudieron cargar los resultados");
      }
    } catch (error) {
      console.error("Error loading exam results:", error);
      toast.error("Error al cargar los resultados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleViewResults}
        disabled={loading}
        className={className}
      >
        {children || (
          <>
            <Trophy className="h-4 w-4 mr-2" />
            Ver Resultados
          </>
        )}
      </Button>

      <ExamResultsViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
        onRetakeExam={() => {
          setIsModalOpen(false);
          // Navigate to exam retake
        }}
        onViewExam={() => {
          setIsModalOpen(false);
          // Navigate to exam view
        }}
      />
    </>
  );
}
