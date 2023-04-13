import { ObjectId } from 'mongodb';

import client, { getSkillsCollection } from '@/common/mongoClient';
import { Skill } from '@/app/types/skills';

type SkillWithDepth = Skill & { depth: number };

const getPrerequisiteSkills = async (
  skillIds: (string | ObjectId)[]
): Promise<SkillWithDepth[]> => {
  const skillsCollection = getSkillsCollection(client);

  const _ids = skillIds.map((id) => new ObjectId(id));

  try {
    const results = await skillsCollection
      .aggregate([
        {
          $match: { _id: { $in: _ids } },
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

    const prerequisites = results.flatMap(
      (skill) => skill.prerequisites as SkillWithDepth[]
    );
    return prerequisites;
  } catch (error) {
    console.error('Error fetching prerequisite skills:', error);
    throw error;
  }
};
export default getPrerequisiteSkills;
