import { ObjectId } from 'mongodb';
import type { PlainSkill, Skill } from '../types/skills';

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
