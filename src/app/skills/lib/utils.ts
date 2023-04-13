import { PlainSkill, Skill } from '@/app/types/skills';
import { Collection, Document, ObjectId } from 'mongodb';

// ObjectIds are not serializable, so we need to convert them to strings
// before exchanging them between the server and client
export const toPlainSkill = (skill: Skill): PlainSkill => {
  return {
    ...skill,
    _id: skill._id.toHexString(),
    prerequisiteIds: skill.prerequisiteIds.map((id: ObjectId) =>
      id.toHexString()
    ),
  };
};

// check if all documents with specified IDs exist in the collection
export const doDocumentsExist = async <D extends Document>(
  collection: Collection<D>,
  documentIds: ObjectId[] | string[]
): Promise<boolean> => {
  const _ids = documentIds.map((id) => new ObjectId(id));
  const existingDocumentsCount = await collection.countDocuments({
    _id: { $in: _ids },
  });

  return existingDocumentsCount === documentIds.length;
};

// check if there is a circular dependency
// between the specified skill and its prerequisite skills
export const isCircularDependency = async (
  skillsCollection: Collection<Skill>,
  skill: Pick<Skill, '_id' | 'prerequisiteIds'>
): Promise<boolean> => {
  const prerequisiteIds = skill.prerequisiteIds;
  const skillId = skill._id;

  // trivial cases
  if (prerequisiteIds.length === 0) {
    return false;
  }
  if (prerequisiteIds.includes(skillId)) {
    return true;
  }

  const result = await skillsCollection
    .aggregate([
      {
        $match: {
          _id: { $in: prerequisiteIds },
        },
      },
      {
        $graphLookup: {
          from: 'skills',
          startWith: '$prerequisiteIds',
          connectFromField: 'prerequisiteIds',
          connectToField: '_id',
          as: 'dependencyChain',
        },
      },
      {
        $match: {
          dependencyChain: {
            $elemMatch: { _id: skillId },
          },
        },
      },
    ])
    .toArray();

  return result.length > 0;
};
