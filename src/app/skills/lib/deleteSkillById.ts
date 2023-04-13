import { ObjectId } from 'mongodb';

import client, { getSkillsCollection } from '@/common/mongoClient';

const skillsCollection = getSkillsCollection(client);

const deleteSkillById = async (skillId: ObjectId | string) => {
  const skillsWithPrerequisite = await skillsCollection
    .find({ prerequisiteIds: new ObjectId(skillId) })
    .toArray();
  if (skillsWithPrerequisite.length > 0) {
    const prerequisites = skillsWithPrerequisite.map(
      (skill) => skill.description
    );
    throw new Error(
      `Cannot delete skill with ID ${skillId}` +
        `because it is a prerequisite for the following skills:` +
        prerequisites.join(', ').toString()
    );
  }

  try {
    const { value: deletedSkill } = await skillsCollection.findOneAndDelete({
      _id: new ObjectId(skillId),
    });

    if (!deletedSkill) {
      throw new Error(`Skill does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting skill with ID ${skillId}:`, error);
    throw error;
  }
};
export default deleteSkillById;
