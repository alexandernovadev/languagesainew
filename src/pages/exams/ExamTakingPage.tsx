import React from 'react';
import { ExamTakingPage as ExamTakingComponent } from '@/components/exam/ExamTakingPage';
import { PageLayout } from '@/components/layouts/page-layout';

export default function ExamTakingPage() {
  return (
    <PageLayout>
      <ExamTakingComponent />
    </PageLayout>
  );
} 