import Link from 'next/link';

import { Skill } from '@/app/types/skills';

type SkillWithDepth = Skill & { depth: number };
type Props = { prerequisites: SkillWithDepth[] };

export default function PrerequisitesList({ prerequisites }: Props) {
  const prerequisitesView =
    prerequisites.length === 0 ? (
      <p>No prerequisites!</p>
    ) : (
      prerequisites.map((skill) => (
        <li key={skill._id.toHexString()}>
          <Link href={`/skills/${skill._id}`}>
            {skill.description} ({skill.syllabuses[0]['course']}{' '}
            {skill.syllabuses[0]['subject']})
          </Link>
        </li>
      ))
    );

  return (
    <>
      <h3>Prerequisites</h3>
      <ol>{prerequisitesView}</ol>
    </>
  );
}
