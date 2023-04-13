import { Filter } from 'mongodb';

import client, { getSkillsCollection } from '@/common/mongoClient';
import { Skill, COURSES, SUBJECTS, TOPICS } from '@/app/types/skills';

export type Query = {
  course?: string;
  subject?: string;
  topic?: string;
  code?: string | string[];
  text?: string;
};

type VerifiedQueryWithoutCourse = {
  code?: string | string[];
  topic?: typeof TOPICS[number];
  text?: string;
};
type VerifiedQueryWithCourse = VerifiedQueryWithoutCourse & {
  course: typeof COURSES[number];
  subject?: typeof SUBJECTS[VerifiedQueryWithCourse['course']][number];
};
type VerifiedQuery = VerifiedQueryWithoutCourse | VerifiedQueryWithCourse;

const verifyQuery = (query: Query): VerifiedQuery => {
  const { text, course, subject, topic, code } = query;
  const verifiedQuery: Query = {};

  if (text) {
    verifiedQuery.text = text;
  }
  if (code) {
    verifiedQuery.code = code;
  }
  if (topic && TOPICS.includes(topic)) {
    verifiedQuery.topic = topic;
  }

  if (course && COURSES.includes(course)) {
    verifiedQuery.course = course;

    const possibleSubjects = SUBJECTS[course];
    if (subject && possibleSubjects.includes(subject)) {
      verifiedQuery.subject = subject;
    }
  }

  return verifiedQuery as VerifiedQuery;
};

const searchSkills = async (query: Query): Promise<Skill[]> => {
  const skillsCollection = getSkillsCollection(client);
  const filter: Filter<Skill> = {};

  const verifiedQuery = verifyQuery(query);
  const { course, subject, topic, code, text } = {
    course: undefined,
    subject: undefined,
    ...verifiedQuery,
  };

  if (course || subject || code) {
    let codeFilter;
    if (Array.isArray(code)) {
      codeFilter = { $in: code };
    } else if (code) {
      codeFilter = code;
    }

    filter.syllabuses = {
      $elemMatch: {
        ...(course && { course }),
        ...(subject && { subject }),
        ...(codeFilter && { code: codeFilter }),
      },
    };
  }

  if (topic) {
    filter.topic = topic;
  }

  if (text) {
    filter.$text = { $search: text };
  }

  const skills = await skillsCollection.find(filter).toArray();
  return skills;
};
export default searchSkills;
