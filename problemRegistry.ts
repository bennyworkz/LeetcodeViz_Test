import { Problem } from './types';
import GCDStringsVisualizer from './problems/GCDStringsVisualizer';

export const problems: Problem[] = [
  {
    id: '1071-gcd-strings',
    number: 1071,
    title: 'GCD of Strings',
    difficulty: 'Easy',
    component: GCDStringsVisualizer,
  },
  // Future problems will be added here
];

export const getProblemById = (id: string) => problems.find((p) => p.id === id);