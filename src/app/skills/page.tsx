import { Fragment } from 'react';
import searchSkills, { Query } from './lib/searchSkills';
import Skill from './SkillSummary';
import { toPlainSkill } from './lib/utils';
import SearchForm from './SearchForm';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const queryKeys: (keyof Query)[] = [
  'course',
  'subject',
  'topic',
  'code',
  'text',
];
const parseSearchParams = (searchParams: Props['searchParams']) => {
  const parsed: Partial<Query> = {};
  for (const key of queryKeys) {
    if (searchParams[key] !== undefined) {
      if (typeof searchParams[key] === 'string') {
        parsed[key] = searchParams[key] as string;
      } else {
        parsed[key] = (searchParams[key] as string[])[0];
      }
    }
  }
  return parsed;
};

export default async function Skills({ searchParams }: Props) {
  const parsedParams = parseSearchParams(searchParams);
  const skills = await searchSkills(parsedParams);

  return (
    <main>
      <h1>Skills</h1>
      <h2>Search</h2>
      <SearchForm parsedParams={parsedParams} />
      {skills.map((skill) => (
        <Fragment key={skill._id.toHexString()}>
          <Skill skill={toPlainSkill(skill)} />
        </Fragment>
      ))}
    </main>
  );
}
