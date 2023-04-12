import { ObjectId } from 'mongodb';

// Interface for Skills
export type Topic =
  | 'Number'
  | 'Algebra'
  | 'Geometry'
  | 'Measurement'
  | 'Probability'
  | 'Statistics'
  | 'Calculus';
export const COURSES = {
  AC: [7, 8, 9, 10, 11, 12],
  IB: ['AA SL', 'AA HL', 'AI HL', 'AI SL'],
  HSC: ['Advanced', 'Standard 2', 'Extension 1', 'Extension 2'],
} as const;
export type Syllabus = {
  [course in keyof typeof COURSES]?: {
    subject: typeof COURSES[course][number];
    code?: string;
  };
};
export interface ExampleQuestion {
  question: string;
  answer: string;
}
export interface Skill {
  _id: ObjectId;
  topic: Topic;
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
