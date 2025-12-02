import React from 'react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string; // The URL slug
  number: number;
  title: string;
  difficulty: Difficulty;
  component: React.ComponentType;
}

export interface CodeLineProps {
  num: number;
  code: string;
  active?: boolean;
}