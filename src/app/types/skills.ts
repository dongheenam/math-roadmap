import { ObjectId } from 'mongodb';

// Interface for Skills
export const COURSES = ['AC', 'IB'] as const;
export const SUBJECTS = {
  AC: ['7', '8', '9', '10', '11', '12'],
  IB: ['AA SL', 'AA HL', 'AI HL', 'AI SL'],
  // HSC: ['Advanced', 'Standard 2', 'Extension 1', 'Extension 2'],
} as const;
export const TOPICS = {
  AC: [
    'Number',
    'Algebra',
    'Measurement',
    'Space',
    'Statistics',
    'Probability',
  ],
  IB: [
    'Number and Algebra',
    'Functions',
    'Geometry and Trigonometry',
    'Probability and Statistics',
    'Calculus',
  ],
} as const;
export type Syllabus = {
  [course in keyof typeof SUBJECTS]?: {
    subject: typeof SUBJECTS[course][number];
    topic: typeof TOPICS[course][number];
    code?: string;
  };
};
export interface ExampleQuestion {
  question: string;
  answer: string;
}
export interface Skill {
  _id: ObjectId;
  description: string;
  syllabus: Syllabus;
  exampleQuestions: ExampleQuestion[];
  prerequisiteIds: ObjectId[];
}
// see @/app/skills/utils.ts
export type PlainSkill = Omit<Skill, '_id' | 'prerequisiteIds'> & {
  _id: string;
  prerequisiteIds: string[];
};
