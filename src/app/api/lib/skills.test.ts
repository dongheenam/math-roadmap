import { Skill } from '@/app/types/skills';
import { MongoClient, Db, ObjectId } from 'mongodb';
import uploadNewSkill from './uploadNewSkill';

// Mock database connection
let connection: MongoClient;
let db: Db;

// Set up database connection before tests
beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGO_URL"');
  }
  connection = await MongoClient.connect(uri);
  db = connection.db();
});

afterAll(async () => {
  await connection.close();
});

describe('uploadNewSkill', () => {
  it('should create a new skill', async () => {
    const testSkill: Skill = {
      _id: new ObjectId(),
      code: 'MATH-001',
      description: 'Basic addition',
      yearLevels: {
        AC: 1,
        DP: 1,
        MYP: 1,
        HSC: 1,
      },
      exampleQuestions: [
        {
          _id: '60a4a29a093a4c542476d76f',
          question: 'What is the sum of 2 + 2?',
          answer: '4',
        },
      ],
      prerequisiteIds: [],
    };
    await uploadNewSkill(testSkill);

    const createdSkill = await db
      .collection('skills')
      .findOne({ _id: testSkill._id });

    expect(createdSkill).toMatchObject(testSkill);
  });
});
