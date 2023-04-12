import { Fragment } from 'react';
import searchSkills, { Query } from '../api/lib/searchSkills';
import { COURSES } from '../types/skills';
import Skill from './Skill';
import { toPlainSkill } from './utils';

type Props = {
  searchParams: Partial<Record<keyof typeof COURSES, string>> & {
    topic?: string;
    searchText?: string;
    prequisitesOf?: string;
  };
};

export default async function Skills({ searchParams }: Props) {
  const query: Query = {};

  for (const course in COURSES) {
    const subject = searchParams[course as keyof typeof COURSES];
    if (subject) {
      query.syllabus = { [course]: subject };
    }
  }
  if (searchParams.topic) {
    query.topic = searchParams.topic;
  }
  if (searchParams.searchText) {
    query.searchText = searchParams.searchText;
  }

  const skills = await searchSkills(query);

  return (
    <main>
      <h1>Skills</h1>
      {skills.map((skill) => (
        <Fragment key={skill._id.toHexString()}>
          <Skill skill={toPlainSkill(skill)} />
        </Fragment>
      ))}
    </main>
  );
}
