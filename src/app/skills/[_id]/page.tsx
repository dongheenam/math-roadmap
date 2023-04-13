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

  const syllabusAC = skill.syllabus.AC;
  const syllabusIB = skill.syllabus.IB;

  return (
    <main>
      <h2>{skill.description}</h2>
      <ul>
        {syllabusAC && (
          <li>
            Australian Curriculum: Year {syllabusAC.subject} {syllabusAC.topic}
          </li>
        )}
        {syllabusIB && (
          <li>
            IBDP: {syllabusIB.topic} {syllabusIB.subject}
          </li>
        )}
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
