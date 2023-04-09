import { ObjectId } from 'mongodb';

import client, { getCollection } from './mongodb';
import type { Skill } from '@/app/types/skills';

const skills = getCollection(client, 'skills');

const doSkillsExist = async (skillIds: ObjectId[]): Promise<boolean> => {
  const count = await skills.countDocuments({ _id: { $in: skillIds } });
  return count === skillIds.length;
};

const uploadNewSkill = async (skill: Skill): Promise<Skill> => {
  if (!doSkillsExist(skill.prerequisiteIds)) {
    throw new Error("Prerequisite skills don't exist");
  }
  const { insertedId } = await skills.insertOne(skill);
  return { ...skill, _id: insertedId };
};
export default uploadNewSkill;
