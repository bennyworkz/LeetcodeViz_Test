import { lazy } from 'react';
import { Problem } from './types';

// Lazy load the problem components to improve initial page load performance
const GCDStringsVisualizer = lazy(() => import('./problems/GCDStringsVisualizer'));
const MergeStringsVisualizer = lazy(() => import('./problems/MergeStringsVisualizer'));

export const problems: Problem[] = [
  {
    id: '1071-gcd-strings',
    number: 1071,
    title: 'GCD of Strings',
    difficulty: 'Easy',
    component: GCDStringsVisualizer,
  },
  {
    id: '1768-merge-strings',
    number: 1768,
    title: 'Merge Strings Alternately',
    difficulty: 'Easy',
    component: MergeStringsVisualizer,
  },
  // Future problems will be added here
];

export const getProblemById = (id: string) => problems.find((p) => p.id === id);
