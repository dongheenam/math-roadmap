import { ObjectId } from 'mongodb';

import client, { getSkillsCollection } from './mongoClient';
import { Skill } from '@/app/types/skills';

type SkillWithDepth = Skill & { depth: number };

const getPrerequisiteSkills = async (
  skillId: string | ObjectId
): Promise<SkillWithDepth[]> => {
  const skillsCollection = getSkillsCollection(client);

  try {
    const results = await skillsCollection
      .aggregate([
        {
          $match: { _id: new ObjectId(skillId) },
        },
        {
          $graphLookup: {
            from: 'skills',
            startWith: '$prerequisiteIds',
            connectFromField: 'prerequisiteIds',
            connectToField: '_id',
            depthField: 'depth',
            as: 'prerequisites',
          },
        },
        {
          $project: { prerequisites: 1 },
        },
      ])
      .toArray();

    if (results.length === 0) {
      return [];
    }
    return results[0].prerequisites;
  } catch (error) {
    console.error('Error fetching prerequisite skills:', error);
    throw error;
  }
};
export default getPrerequisiteSkills;
