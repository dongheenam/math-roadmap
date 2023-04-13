'use client';

import { useRouter } from 'next/navigation';
import { PlainSkill } from '../types/skills';

type Props = {
  skill: PlainSkill;
};
export default function Skills({ skill }: Props) {
  const router = useRouter();

  const onClickView = () => {
    router.push(`/skills/${skill._id}`);
  };

  const syllabuses = [];
  for (const [course, { subject, topic, code }] of Object.entries(
    skill.syllabus
  )) {
    syllabuses.push(
      <span key={course}>
        {course} {subject} {topic} {code && <>({code})</>}
      </span>
    );
  }
  return (
    <div>
      <h3>{skill.description}</h3>
      <p>{syllabuses}</p>
      <button onClick={onClickView}>View</button>
    </div>
  );
}
