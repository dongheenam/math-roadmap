import { ObjectId } from 'mongodb';

// Interface for Skills
export type Course = {
  AC?: number;
  IB?: 'AA SL' | 'AA HL' | 'AI HL' | 'AI SL';
  HSC?: 'Advanced' | 'Standard 2' | 'Extension 1' | 'Extension 2';
};
export interface ExampleQuestion {
  _id: string;
  question: string;
  answer: string;
}
export interface Skill {
  _id: ObjectId;
  code: string;
  description: string;
  course: Course;
  exampleQuestions: ExampleQuestion[];
  prerequisiteIds: ObjectId[];
}
