import React, { lazy } from 'react';

// Lazy load components
const NumberSystemNotes = lazy(() => import('./Apti_Notes/NumberSystemNotes'));
const HCFandLCMNotes = lazy(() => import('./Apti_Notes/HCFandLCMNotes'));
const DecimalAndFractionNotes = lazy(() => import('./Apti_Notes/DecimalAndFractionNotes'));
const SurdsAndIndicesNotes = lazy(() => import('./Apti_Notes/SurdsAndIndicesNotes'));
const DivisibilityNotes = lazy(() => import('./Apti_Notes/DivisibilityNotes'));
const AgesMasterNotes = lazy(() => import('./Apti_Notes/AgesMasterNotes'));
const InverseNotes = lazy(() => import('./Apti_Notes/InverseNotes'));
const SpeedTimeDistanceNotes =  lazy(() => import('./Apti_Notes/SpeedTimeDistanceNotes'));
const TimeAndWorkNotes = lazy(() => import('./Apti_Notes/TimeAndWorkNotes'));
const BoatsAndStreamsNotes = lazy(() => import('./Apti_Notes/BoatsAndStreamsNotes'));
const PipesAndCisternsNotes = lazy(() => import('./Apti_Notes/PipesAndCisternsNotes'));
const AveragesNotes = lazy(() => import('./Apti_Notes/AveragesNotes'));
const MixturesNotes = lazy(() => import('./Apti_Notes/MixturesNotes'));

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
    title: 'Quantitative Aptitude Module',
    description: 'Complete quantitative aptitude preparation covering all essential topics for competitive exams and interviews.',
    problems: [],
    subModules: [
      {
        id: 'number-system',
        title: 'Number System Sub-module',
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
            title: 'Number System Notes (comprehensive tutorial)',
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
          {
            id: 'inverse',
            title: 'Inverse',
            difficulty: 'beginner',
            component: InverseNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'speed-time-distance',
            title: 'Speed and Distance',
            difficulty: 'beginner',
            component: SpeedTimeDistanceNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'Time and Work',
            title: 'Time and Work',
            difficulty: 'beginner',
            component: TimeAndWorkNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'Boat and Streams',
            title: 'Boat and Streams',
            difficulty: 'beginner',
            component: BoatsAndStreamsNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'Pipes and Cisterns',
            title: 'Pipes and Cisterns',
            difficulty: 'beginner',
            component: PipesAndCisternsNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'Averages',
            title: 'Averages',
            difficulty: 'beginner',
            component: AveragesNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'mixtures',
            title: 'Mixtures and Alligation',
            difficulty: 'beginner',
            component: MixturesNotes,
            tags: ['numbers', 'divisibility', 'formulas', 'speed-math', 'aptitude']
          },
          {
            id: 'Mixtures',
            title: 'Alligations and Mixture',
            difficulty: 'beginner',
            component: MixturesNotes,
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