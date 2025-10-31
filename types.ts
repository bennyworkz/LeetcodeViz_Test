import React from 'react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string; // The URL slug
  number: number;
  title: string;
  difficulty: Difficulty;
  // Supports standard components or lazy loaded chunks
  component: React.ComponentType | React.LazyExoticComponent<any>;
  tags?: string[]; // Topic tags for filtering and search
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  problems: Problem[];
  subModules?: Module[]; // Support for nested sub-modules
}

export interface CodeLineProps {
  num: number;
  code: string;
  active?: boolean;
}