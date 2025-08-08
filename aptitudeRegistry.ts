import React, { lazy } from 'react';

// Lazy load components
const NumberSystemNotes = lazy(() => import('./Apti_Notes/NumberSystemNotes.tsx'));
const HCFandLCMNotes = lazy(() => import('./Apti_Notes/HCFandLCMNotes.tsx'));
const DecimalAndFractionNotes = lazy(() => import('./Apti_Notes/DecimalAndFractionNotes.tsx'));
const SurdsAndIndicesNotes = lazy(() => import('./Apti_Notes/SurdsAndIndicesNotes.tsx'));
const DivisibilityNotes = lazy(() => import('./Apti_Notes/DivisibilityNotes.tsx'));
const AgesMasterNotes = lazy(() => import('./Apti_Notes/AgesMasterNotes.tsx'));

export interface AptitudeNote {
  id: string;
  number?: number;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  tags: string[];
}

export interface AptitudeSubModule {
  id: string;
  title: string;
  description: string;
  problems: AptitudeNote[];
}

export interface AptitudeModule {
  id: string;
  title: string;
  description: string;
  problems: AptitudeNote[];
  subModules: AptitudeSubModule[];
}

export const aptitudeModules: AptitudeModule[] = [
  {
    id: 'quantitative-aptitude',
    title: 'Quantitative Aptitude',
    description: 'Complete quantitative aptitude preparation covering all essential topics for competitive exams and interviews.',
    problems: [],
    subModules: [
      {
        id: 'number-system',
        title: 'Number System',
        description: 'Fundamental concepts of numbers, operations, divisibility rules, and mathematical properties.',
        problems: [
          {
            id: 'hcf-lcm-notes',
            title: 'HCF and LCM ',
            difficulty: 'beginner',
            component: HCFandLCMNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'number-system-notes',
            title: 'Number System Notes',
            difficulty: 'beginner',
            component: NumberSystemNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'decimal-and-fraction-notes',
            title: 'Decimal and Fraction',
            difficulty: 'beginner',
            component: DecimalAndFractionNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'surds-and-indices',
            title: 'Surds and Indices',
            difficulty: 'beginner',
            component: SurdsAndIndicesNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'divisibility',
            title: 'Divisibility',
            difficulty: 'beginner',
            component: DivisibilityNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'ages',
            title: 'Ages',
            difficulty: 'beginner',
            component: AgesMasterNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
        ]
      }
    ]
  }
];

export const aptitudeCategories = [
  {
    name: 'Number System',
    count: 1,
    description: 'Fundamental concepts of numbers, operations, and mathematical properties'
  }
];

// Helper function to get note by ID (similar to getProblemById)
export const getAptitudeNoteById = (id: string): AptitudeNote | null => {
  for (const module of aptitudeModules) {
    // Check in main problems array
    const problem = module.problems.find(p => p.id === id);
    if (problem) return problem;
    
    // Check in subModules
    for (const subModule of module.subModules) {
      const subProblem = subModule.problems.find(p => p.id === id);
      if (subProblem) return subProblem;
    }
  }
  return null;
};

export default aptitudeModules;