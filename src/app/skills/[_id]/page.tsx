import { Suspense } from 'react';

import getSkillById from '@/app/skills/lib/getSkillById';
import getPrerequisiteSkills from '../lib/getPrerequisiteSkills';
import SkillsList from '../SkillsList';

type Props = {
  params: { _id: string };
};

export default async function Page({ params }: Props) {
  const _id = params._id;
  const skill = await getSkillById(_id);
  if (!skill) {
    throw new Error('Skill not found!');
  }
  // Easier skills have a higher depth
  const prerequisites = (await getPrerequisiteSkills([_id])).sort(
    (a, b) => b.depth - a.depth
  );

  return (
    <main>
      <h2>Skill: {skill.description}</h2>
      <ul>
        {skill.syllabuses.map(({ course, subject, code }) => (
          <li key={course}>
            {course} {subject} {code && <>{code}</>}
          </li>
        ))}
      </ul>
      <h3>Example questions</h3>
      {skill.exampleQuestions.map((item, idx) => (
        <details key={idx}>
          <summary>
            <span>{item.question}</span>
          </summary>
          <span>{item.answer}</span>
        </details>
      ))}
      <h3>Prerequisites</h3>
      <Suspense>
        <SkillsList skills={prerequisites} />
      </Suspense>
    </main>
  );
}
