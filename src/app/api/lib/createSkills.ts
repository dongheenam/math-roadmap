import client, { getSkillsCollection } from './mongoClient';
import type { Skill } from '@/app/types/skills';
import { doDocumentsExist } from './utils';

const createSkills = async (skills: Skill[]): Promise<void> => {
  const skillsCollection = getSkillsCollection(client);

  // Check if all prerequisite skills exist
  const allPrerequisiteIds = skills
    .flatMap((skill) => skill.prerequisiteIds)
    .map((_id) => _id.toHexString());
  const uniquePrerequisiteIds = Array.from(new Set(allPrerequisiteIds));

  const inputSkillIds = skills.map((skill) => skill._id.toHexString());
  const requriedPrerequisiteIds = uniquePrerequisiteIds.filter(
    (_id) => !inputSkillIds.includes(_id)
  );

  const prerequisitesExist = await doDocumentsExist(
    skillsCollection,
    requriedPrerequisiteIds
  );
  if (!prerequisitesExist) {
    throw new Error('Some prerequisite skills do not exist.');
  }

  const { insertedCount, acknowledged } = await skillsCollection.insertMany(
    skills
  );

  if (!acknowledged) {
    throw new Error('Insertion was not acknowledged.');
  }
  if (insertedCount !== skills.length) {
    console.warn(
      'Some skills were not inserted. Expected:',
      skills.length,
      'Inserted:',
      insertedCount
    );
  }
};
export default createSkills;
