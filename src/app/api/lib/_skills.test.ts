import { Skill } from '@/app/types/skills';
import { MongoClient, Db, ObjectId } from 'mongodb';
import createSkill from './createSkill';
import client from './mongoClient';
import getSkillById from './getSkillById';
import editSkill from './editSkill';
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
const skills: Skill[] = [
  {
    _id: new ObjectId(),
    topic: 'Algebra',
    description: 'Solving simple linear equations',
    syllabus: { AC: { subject: 7 } },
    exampleQuestions: [
      {
        question: 'Solve for $x$: $2x + 4 = 10$',
        answer: '$x = 3$',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Geometry',
    description: 'Calculating the area of a triangle',
    syllabus: { AC: { subject: 7 } },
    exampleQuestions: [
      {
        question:
          'Calculate the area of a triangle with a base of $6$ cm and a height of $4$ cm.',
        answer: 'The area is $12$ square centimeters.',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Algebra',
    description: 'Solving quadratic equations',
    syllabus: { AC: { subject: 10 } },
    exampleQuestions: [
      {
        question: 'Solve for $x$: $x^2 - 4x + 4 = 0$',
        answer: '$x = 2$',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Geometry',
    description: 'Calculating the sine of an angle',
    syllabus: { HSC: { subject: 'Advanced' } },
    exampleQuestions: [
      {
        question: 'Calculate the sine of a $30^\\circ$ angle.',
        answer: '$\\sin{30^\\circ} = 0.5$',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Geometry',
    description: 'Solving right triangles',
    syllabus: { HSC: { subject: 'Advanced' } },
    exampleQuestions: [
      {
        question:
          'In a right triangle with an angle of $45^\\circ$ and a hypotenuse of $10$ cm, calculate the lengths of the other two sides.',
        answer: 'The other two sides are both approximately $7.07$ cm long.',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Calculus',
    description: 'Differentiation of polynomial functions',
    syllabus: { IB: { subject: 'AI HL' } },
    exampleQuestions: [
      {
        question: 'Find the derivative of $f(x) = 2x^3 - 4x^2 + 6x - 2$.',
        answer: "$f'(x) = 6x^2 - 8x + 6$",
      },
    ],

    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Calculus',
    description: 'Integration of polynomial functions',
    syllabus: { IB: { subject: 'AI HL' } },
    exampleQuestions: [
      {
        question: 'Find the integral of $f(x) = 3x^2 - 2x + 4$.',
        answer: '$F(x) = x^3 - x^2 + 4x + C$',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Geometry',
    description: 'Calculating the volume of a cylinder',
    syllabus: { AC: { subject: 10 } },
    exampleQuestions: [
      {
        question:
          'Find the volume of a cylinder with a radius of $3$ cm and a height of $5$ cm.',
        answer: 'The volume is $45\\pi$ cubic centimeters.',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Algebra',
    description: 'Solving systems of linear equations',
    syllabus: { HSC: { subject: 'Advanced' } },
    exampleQuestions: [
      {
        question:
          'Solve the system of equations: $\\begin{cases} x + 2y = 7 \\\\ 3x - y = 2 \\end{cases}$',
        answer: '$x = 1, y = 3$',
      },
    ],
    prerequisiteIds: [],
  },
  {
    _id: new ObjectId(),
    topic: 'Geometry',
    description: 'Calculating the cosine of an angle',
    syllabus: { HSC: { subject: 'Advanced' } },
    exampleQuestions: [
      {
        question: 'Calculate the cosine of a $60^\\circ$ angle.',
        answer: '$\\cos{60^\\circ} = 0.5$',
      },
    ],
    prerequisiteIds: [],
  },
];
skills[2].prerequisiteIds = [skills[0]._id];
skills[4].prerequisiteIds = [skills[3]._id];
skills[5].prerequisiteIds = [skills[2]._id];
skills[6].prerequisiteIds = [skills[2]._id, skills[5]._id];
skills[7].prerequisiteIds = [skills[1]._id];
skills[8].prerequisiteIds = [skills[0]._id, skills[2]._id];
skills[9].prerequisiteIds = [skills[3]._id, skills[4]._id];

describe('uploadNewSkill', () => {
  it('should create new skills', async () => {
    for (const skill of skills) {
      const uploadedSkill = await createSkill(skill);
      const downloadedSkill = await getSkillById(skill._id);

      expect(downloadedSkill).toMatchObject(uploadedSkill);
    }
  });

  it('should throw an error if skill ID is not unique', async () => {
    await expect(createSkill(skills[0])).rejects.toThrow(
      /E11000 duplicate key error/
    );
  });

  it('should throw an error if prerequisite skills do not exist', async () => {
    let skill: Skill = {
      ...skills[1],
      _id: new ObjectId(),
      prerequisiteIds: [new ObjectId()],
    };

    await expect(createSkill(skill)).rejects.toThrow(
      "Prerequisite skills don't exist"
    );
  });
});

describe('editSkill', () => {
  it("should update a skill's description", async () => {
    const skill = await getSkillById(skills[0]._id);
    if (skill) {
      const updates: Partial<Skill> = {
        description: 'Basic addition and subtraction',
        topic: 'Number',
        syllabus: { HSC: { subject: 'Advanced' }, IB: { subject: 'AI SL' } },
      };
      await editSkill(skill._id, updates);

      const updatedSkill = await getSkillById(skill._id!);

      expect(updatedSkill?.description).toBe(updates.description);
    }
  });

  it("should update a skill's prerequisite skills", async () => {
    const skill = await getSkillById(skills[4]._id);
    if (skill) {
      const updates = {
        prerequisiteIds: [skills[0]._id],
      };
      await editSkill(skill._id, updates);

      const updatedSkill = await getSkillById(skill._id!);

      expect(updatedSkill?.prerequisiteIds).toMatchObject(
        updates.prerequisiteIds
      );
    }
  });

  it("should throw an error if prerequisite skills don't exist", async () => {
    const skill = await getSkillById(skills[3]._id);
    if (skill) {
      const updates = {
        prerequisiteIds: [new ObjectId()],
      };

      await expect(editSkill(skill._id, updates)).rejects.toThrow(
        `One or more prerequisite skills do not exist.`
      );
    }
  });

  it('should throw an error if prerequisite skills create a circular dependency', async () => {
    const skill = await getSkillById(skills[0]._id);
    if (skill) {
      const updates = {
        prerequisiteIds: [skills[5]._id],
      };

      await expect(editSkill(skill._id, updates)).rejects.toThrow(
        'Circular dependency detected'
      );
    }
  });
});

describe('deleteSkillById', () => {
  it('should delete a skill', async () => {
    const skill = await getSkillById(skills[7]._id);
    if (skill) {
      await expect(deleteSkillById(skill._id!)).resolves.toBeUndefined();
    }
  });

  it("should throw an error if skill doesn't exist", async () => {
    await expect(deleteSkillById(new ObjectId())).rejects.toThrow(
      /does not exist/
    );
  });

  it('should throw an error if skill is a prerequisite for another skill', async () => {
    const skill = await getSkillById(skills[3]._id);
    if (skill) {
      await expect(deleteSkillById(skill._id!)).rejects.toThrow(
        /because it is a prerequisite for the following skills/
      );
    }
  });
});
