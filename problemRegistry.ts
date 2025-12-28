import { lazy } from 'react';
import { Module, Problem } from './types';

// Lazy load the problem components to improve initial page load performance
const GCDStringsVisualizer = lazy(() => import('./problems/GCDStringsVisualizer'));
const MergeStringsVisualizer = lazy(() => import('./problems/MergeStringsVisualizer'));
const KidsCandiesVisualizer = lazy(() => import('./problems/KidsCandiesVisualizer'));
const CanPlaceFlowersVisualizer = lazy(() => import('./problems/CanPlaceFlowersVisualizer'));
const ReverseVowelsVisualizer = lazy(() => import('./problems/ReverseVowelsVisualizer'));
const ReverseWordsVisualizer = lazy(() => import('./problems/ReverseWordsVisualizer'));
const ProductExceptSelfVisualizer = lazy(() => import('./problems/ProductExceptSelfVisualizer'));

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
      {
        id: '605-can-place-flowers',
        number: 605,
        title: 'Can Place Flowers',
        difficulty: 'Easy',
        component: CanPlaceFlowersVisualizer,
      },
      {
        id: '345-reverse-vowels',
        number: 345,
        title: 'Reverse Vowels of a String',
        difficulty: 'Easy',
        component: ReverseVowelsVisualizer,
      },
      {
        id: '151-reverse-words',
        number: 151,
        title: 'Reverse Words in a String',
        difficulty: 'Medium',
        component: ReverseWordsVisualizer,
      },
      {
        id: '238-product-except-self',
        number: 238,
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        component: ProductExceptSelfVisualizer,
      },
    ]
  },
];

// Helper to flatten problems for searching by ID
export const getProblemById = (id: string): Problem | undefined => {
  for (const module of modules) {
    const problem = module.problems.find((p) => p.id === id);
    if (problem) return problem;
  }
  return undefined;
};