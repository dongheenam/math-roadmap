import { ObjectId } from 'mongodb';

import client, { getSkillsCollection } from './mongoClient';

const skillsCollection = getSkillsCollection(client);

const deleteSkillById = async (skillId: ObjectId | string) => {
  const skillsWithPrerequisite = await skillsCollection
    .find({ prerequisiteIds: new ObjectId(skillId) })
    .toArray();
  if (skillsWithPrerequisite.length > 0) {
    const skillCodes = skillsWithPrerequisite.map((skill) => skill.code);
    throw new Error(
      `Cannot delete skill with ID ${skillId} because it is a prerequisite for the following skills: ${skillCodes.join(
        ', '
      )}`
    );
  }

  try {
    const { value: deletedSkill } = await skillsCollection.findOneAndDelete({
      _id: new ObjectId(skillId),
    });

    if (!deletedSkill) {
      throw new Error(`Skill with ID ${skillId} does not exist.`);
    }

    console.log(`Skill with ID ${skillId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting skill with ID ${skillId}:`, error);
    throw error;
  }
};
export default deleteSkillById;
