import { Filter } from 'mongodb';

import client, { getSkillsCollection } from './mongoClient';
import { COURSES, Skill } from '@/app/types/skills';

export type Query = {
  syllabus?: {
    [course in keyof typeof COURSES]?: string;
  };
  topic?: string;
  searchText?: string;
};

const searchSkills = async (query: Query): Promise<Skill[]> => {
  const skillsCollection = getSkillsCollection(client);
  const filter: Filter<Skill> = {};

  if (query.syllabus) {
    for (const [key, value] of Object.entries(query.syllabus)) {
      filter[`syllabus.${key}.subject`] =
        key === 'AC' ? parseInt(value) : value;
    }
  }
  if (query.topic) {
    filter.$topic = query.topic;
  }
  if (query.searchText) {
    filter.$text = { $search: query.searchText };
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
