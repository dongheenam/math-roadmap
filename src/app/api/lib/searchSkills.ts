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

const verifyQuery = (query: Query): Query => {
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

  return verifiedQuery;
};

const searchSkills = async (query: Query): Promise<Skill[]> => {
  const skillsCollection = getSkillsCollection(client);
  const filter: Filter<Skill> = {};

  const verifiedQuery = verifyQuery(query);

  if (verifiedQuery.course) {
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
