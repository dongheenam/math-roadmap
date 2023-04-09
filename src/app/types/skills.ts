import { ObjectId } from 'mongodb';

// Interface for Skills
export type Course = 'AC' | 'DP' | 'MYP' | 'HSC';
export type YearLevels = {
  [course in Course]: number;
};
export interface ExampleQuestion {
  _id: string;
  question: string;
  answer: string;
}
export interface Skill {
  _id?: ObjectId | undefined;
  code: string;
  description: string;
  yearLevels: YearLevels;
  exampleQuestions: ExampleQuestion[];
  prerequisiteIds: ObjectId[];
}
