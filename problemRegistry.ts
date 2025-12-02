import { Problem } from './types';
import GCDStringsVisualizer from './problems/GCDStringsVisualizer';
import MergeStringsVisualizer from './problems/MergeStringsVisualizer';

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