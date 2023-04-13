import getSkillById from '@/app/api/lib/getSkillById';
import Prerequisites from './Prerequisites';

type Props = {
  params: { _id: string };
};

export default async function Page({ params }: Props) {
  const _id = params._id;
  const skill = await getSkillById(_id);
  if (!skill) {
    throw new Error('Skill not found!');
  }

  return (
    <main>
      <h2>{skill.description}</h2>
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
      <Prerequisites _id={_id} />
    </main>
  );
}
