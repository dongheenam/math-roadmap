import { ObjectId } from 'mongodb';

import client, { getSkillsCollection } from './mongoClient';
import type { Skill } from '@/app/types/skills';

const skillsCollection = getSkillsCollection(client);

const getSkillById = async (
  skillId: string | ObjectId
): Promise<Skill | null> => {
  let skill: Skill | null;

  try {
    skill = await skillsCollection.findOne({ _id: new ObjectId(skillId) });
    return skill;
  } catch (error) {
    console.error('Error fetching skill by ID:', error);
    throw error;
  }
};
export default getSkillById;
