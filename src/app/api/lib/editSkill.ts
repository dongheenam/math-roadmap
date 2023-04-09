import { ObjectId } from 'mongodb';

import client, { getSkillsCollection } from './mongoClient';
import type { Skill } from '@/app/types/skills';
import { doDocumentsExist, isCircularDependency } from './utils';

const skillsCollection = getSkillsCollection(client);

const editSkill = async (
  skillId: ObjectId,
  updates: Partial<Skill>
): Promise<void> => {
  if (updates.prerequisiteIds) {
    const prerequisitesExist = await doDocumentsExist(
      skillsCollection,
      updates.prerequisiteIds
    );
    if (!prerequisitesExist) {
      throw new Error(`One or more prerequisite skills do not exist.`);
    }

    const circularDependency = await isCircularDependency(skillsCollection, {
      _id: skillId,
      prerequisiteIds: updates.prerequisiteIds,
    });
    if (circularDependency) {
      throw new Error('Circular dependency detected');
    }
  }

  try {
    const { acknowledged } = await skillsCollection.updateOne(
      { _id: skillId },
      { $set: updates }
    );
    if (!acknowledged) {
      throw new Error('Skill update was not acknowledged');
    }
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};
export default editSkill;
