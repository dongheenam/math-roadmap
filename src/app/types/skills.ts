import { ObjectId } from 'mongodb';

// Interface for Skills
export const COURSES = ['AC', 'IB', 'HSC'] as const;
export const SUBJECTS = {
  AC: ['7', '8', '9', '10', '11', '12'],
  IB: ['AA SL', 'AA HL', 'AI HL', 'AI SL'],
  HSC: ['Advanced', 'Standard 2', 'Extension 1', 'Extension 2'],
} as const;
export const TOPICS = [
  'Number',
  'Algebra',
  'Measurement',
  'Geometry',
  'Statistics',
  'Probability',
  'Calculus',
] as const;
type ACSyllabus = {
  course: 'AC';
  subject: typeof SUBJECTS['AC'][number];
  code?: string;
};
type IBSyllabus = {
  course: 'IB';
  subject: typeof SUBJECTS['IB'][number];
  code?: string;
};
// type HSCSyllabus = {
//   course: "HSC";
//   subject: typeof SUBJECTS['HSC'][number];
//   code?: string;
// };
export type Syllabus = ACSyllabus | IBSyllabus;

export interface ExampleQuestion {
  question: string;
  answer: string;
}
export interface Skill {
  _id: ObjectId;
  description: string;
  topic: typeof TOPICS[number];
  syllabuses: Syllabus[];
  exampleQuestions: ExampleQuestion[];
  prerequisiteIds: ObjectId[];
}
// see @/app/skills/utils.ts
export type PlainSkill = Omit<Skill, '_id' | 'prerequisiteIds'> & {
  _id: string;
  prerequisiteIds: string[];
};
