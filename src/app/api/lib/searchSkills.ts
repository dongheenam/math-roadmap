import { Filter } from 'mongodb';

import client, { getSkillsCollection } from './mongoClient';
import { Skill, COURSES, SUBJECTS, TOPICS } from '@/app/types/skills';

export type Query = {
  course?: string;
  subject?: string;
  topic?: string;
  code?: string;
  searchText?: string;
};

type VerifiedQueryWithoutCourse = {
  code?: string;
  searchText?: string;
};
type VerifiedQueryWithCourse = VerifiedQueryWithoutCourse & {
  course: typeof COURSES[number];
  subject?: typeof SUBJECTS[VerifiedQueryWithCourse['course']][number];
  topic?: typeof TOPICS[VerifiedQueryWithCourse['course']][number];
};
type VerifiedQuery = VerifiedQueryWithoutCourse | VerifiedQueryWithCourse;

const verifyQuery = (query: Query): VerifiedQuery => {
  const verifiedQuery: Query = {};
  if (query.searchText) {
    verifiedQuery.searchText = query.searchText;
  }

  if (query.course && COURSES.includes(query.course)) {
    verifiedQuery.course = query.course;

    const possibleSubjects = SUBJECTS[query.course];
    if (query.subject && possibleSubjects.includes(query.subject)) {
      verifiedQuery.subject = query.subject;
    }
    const possibleTopics = TOPICS[query.course];
    if (query.topic && possibleTopics.includes(query.topic)) {
      verifiedQuery.topic = query.topic;
    }
  }

  return verifiedQuery as VerifiedQuery;
};

const searchSkills = async (query: Query): Promise<Skill[]> => {
  const skillsCollection = getSkillsCollection(client);
  const filter: Filter<Skill> = {};

  const verifiedQuery = verifyQuery(query);

  if ('course' in verifiedQuery) {
    const course = verifiedQuery.course;
    let courseOnly = true;

    if (verifiedQuery.subject) {
      courseOnly = false;
      filter[`syllabus.${course}.subject`] = verifiedQuery.subject;
    }
    if (verifiedQuery.topic) {
      courseOnly = false;
      filter[`syllabus.${course}.topic`] = verifiedQuery.topic;
    }
    if (verifiedQuery.code) {
      courseOnly = false;
      filter[`syllabus.${course}.code`] = verifiedQuery.code;
    }
    if (courseOnly) {
      filter[`syllabus.${course}`] = { $exists: true };
    }
  }
  if (verifiedQuery.searchText) {
    filter.$text = { $search: verifiedQuery.searchText };
  }
  try {
    const skills = await skillsCollection.find(filter).toArray();
    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};
export default searchSkills;
