import Link from 'next/link';

import { Skill } from '@/app/types/skills';

type Props = { skills: Skill[] };

export default function SkillsList({ skills }: Props) {
  const prerequisitesView =
    skills.length === 0 ? (
      <p>No skills!</p>
    ) : (
      skills.map((skill) => (
        <li key={skill._id.toHexString()}>
          <Link href={`/skills/${skill._id}`}>
            {skill.description} ({skill.syllabuses[0]['course']}{' '}
            {skill.syllabuses[0]['subject']})
          </Link>
        </li>
      ))
    );

  return <ol>{prerequisitesView}</ol>;
}
