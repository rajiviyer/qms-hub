"use client";
import React, { Suspense } from 'react';
import ProblemDescription from './ProblemDescription';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProblemDescription />
    </Suspense>
  );
}