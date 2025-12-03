import { lazy } from 'react';
import { Module, Problem } from './types';

// Lazy load the problem components to improve initial page load performance
const GCDStringsVisualizer = lazy(() => import('./problems/GCDStringsVisualizer'));
const MergeStringsVisualizer = lazy(() => import('./problems/MergeStringsVisualizer'));
const KidsCandiesVisualizer = lazy(() => import('./problems/KidsCandiesVisualizer'));

export const modules: Module[] = [
  {
    id: 'leetcode-75',
    title: 'LeetCode 75',
    description: '75 Essential problems to master algorithms',
    problems: [
      {
        id: '1768-merge-strings',
        number: 1768,
        title: 'Merge Strings Alternately',
        difficulty: 'Easy',
        component: MergeStringsVisualizer,
      },
      {
        id: '1071-gcd-strings',
        number: 1071,
        title: 'GCD of Strings',
        difficulty: 'Easy',
        component: GCDStringsVisualizer,
      },
      {
        id: '1431-kids-candies',
        number: 1431,
        title: 'Kids With the Greatest Number of Candies',
        difficulty: 'Easy',
        component: KidsCandiesVisualizer,
      },
    ]
  },
  // Future modules (e.g., "Top 150 Interview") can be added here
];

// Helper to flatten problems for searching by ID
export const getProblemById = (id: string): Problem | undefined => {
  for (const module of modules) {
    const problem = module.problems.find((p) => p.id === id);
    if (problem) return problem;
  }
  return undefined;
};