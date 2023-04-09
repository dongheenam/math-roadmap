import { Skill } from '@/app/types/skills';
import { MongoClient, Db, ObjectId } from 'mongodb';
import uploadNewSkill from './uploadNewSkill';
import client from './mongoClient';
import getSkillById from './getSkillById';
import editSkill from './editSkill';
import { randomInt } from 'crypto';
import deleteSkillById from './deleteSkillById';

// Mock database connection
let connection: MongoClient;
let db: Db;

// Set up database connection before tests
beforeAll(async () => {
  connection = client;
  db = client.db();
});

afterAll(async () => {
  await connection.close();
});

// Mock data sets
const testSkills: Skill[] = Array.from({ length: 6 }, (_, i) => ({
  _id: new ObjectId(),
  code: `MATH-00${i + 1}`,
  description: `Basic math skill ${i + 1}`,
  course: {
    AC: i + 1,
  },
  exampleQuestions: [],
  prerequisiteIds: [],
}));
testSkills[3].prerequisiteIds = [testSkills[0]._id, testSkills[1]._id];
testSkills[4].prerequisiteIds = [testSkills[3]._id];
testSkills[5].prerequisiteIds = [testSkills[2]._id, testSkills[3]._id];

describe('uploadNewSkill', () => {
  it('should create new skills', async () => {
    for (const testSkill of testSkills) {
      const uploadedSkill = await uploadNewSkill(testSkill);
      const downloadedSkill = await getSkillById(testSkill._id);

      expect(downloadedSkill).toMatchObject(uploadedSkill);
    }
  });

  it('should throw an error if skill code is not unique', async () => {
    await expect(uploadNewSkill(testSkills[0])).rejects.toThrow(
      /E11000 duplicate key error/
    );
  });

  it('should throw an error if prerequisite skills do not exist', async () => {
    let testSkill: Skill = {
      ...testSkills[1],
      _id: new ObjectId(),
      prerequisiteIds: [new ObjectId()],
    };

    await expect(uploadNewSkill(testSkill)).rejects.toThrow(
      "Prerequisite skills don't exist"
    );
  });
});

describe('editSkill', () => {
  it("should update a skill's description", async () => {
    const testSkill = await getSkillById(testSkills[0]._id);
    if (testSkill) {
      const updates = {
        description: 'Basic addition and subtraction',
      };
      await editSkill(testSkill._id, updates);

      const updatedSkill = await getSkillById(testSkill._id!);

      expect(updatedSkill?.description).toBe(updates.description);
    }
  });

  it("should update a skill's prerequisite skills", async () => {
    const testSkill = await getSkillById(testSkills[4]._id);
    if (testSkill) {
      const updates = {
        prerequisiteIds: [testSkills[0]._id],
      };
      await editSkill(testSkill._id, updates);

      const updatedSkill = await getSkillById(testSkill._id!);

      expect(updatedSkill?.prerequisiteIds).toMatchObject(
        updates.prerequisiteIds
      );
    }
  });

  it("should throw an error if prerequisite skills don't exist", async () => {
    const testSkill = await getSkillById(testSkills[3]._id);
    if (testSkill) {
      const updates = {
        prerequisiteIds: [new ObjectId()],
      };

      await expect(editSkill(testSkill._id, updates)).rejects.toThrow(
        `One or more prerequisite skills do not exist.`
      );
    }
  });

  it('should throw an error if prerequisite skills create a circular dependency', async () => {
    const testSkill = await getSkillById(testSkills[0]._id);
    if (testSkill) {
      const updates = {
        prerequisiteIds: [testSkills[5]._id],
      };

      await expect(editSkill(testSkill._id, updates)).rejects.toThrow(
        'Circular dependency detected'
      );
    }
  });
});

describe('deleteSkillById', () => {
  it('should delete a skill', async () => {
    const testSkill = await getSkillById(testSkills[4]._id);
    if (testSkill) {
      await expect(deleteSkillById(testSkill._id!)).resolves.toBeUndefined();
    }
  });

  it("should throw an error if skill doesn't exist", async () => {
    await expect(deleteSkillById(new ObjectId())).rejects.toThrow(
      /does not exist/
    );
  });

  it('should throw an error if skill is a prerequisite for another skill', async () => {
    const testSkill = await getSkillById(testSkills[3]._id);
    if (testSkill) {
      await expect(deleteSkillById(testSkill._id!)).rejects.toThrow(
        /because it is a prerequisite for the following skills/
      );
    }
  });
});
