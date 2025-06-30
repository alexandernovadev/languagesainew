import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamPageHeaderProps {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

export function ExamPageHeader({ 
  title = "Exámenes",
  description = "Gestiona y revisa todos tus exámenes",
  showCreateButton = true 
}: ExamPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {showCreateButton && (
        <Button onClick={() => navigate('/generator/exam')}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Examen
        </Button>
      )}
    </div>
  );
} 