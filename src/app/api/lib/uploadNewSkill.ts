import client, { getSkillsCollection } from './mongoClient';
import type { Skill } from '@/app/types/skills';
import { doDocumentsExist, isCircularDependency } from './utils';

const skillsCollection = getSkillsCollection(client);

const uploadNewSkill = async (skill: Skill): Promise<Skill> => {
  if (skill.prerequisiteIds.length > 0) {
    const prerequisitesExist = await doDocumentsExist(
      skillsCollection,
      skill.prerequisiteIds
    );
    if (!prerequisitesExist) {
      throw new Error("Prerequisite skills don't exist");
    }
  }
  const { insertedId } = await skillsCollection.insertOne(skill);
  return { ...skill, _id: insertedId };
};
export default uploadNewSkill;
