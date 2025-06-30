import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ExamPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-8 bg-muted rounded w-32 animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Crear Examen
        </Button>
      </div>

      {/* Search and Actions Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-1">
          <div className="h-10 bg-muted rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-10 animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-10 animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 