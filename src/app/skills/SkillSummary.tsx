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
  for (const { course, subject, code } of skill.syllabuses) {
    syllabuses.push(
      <span key={course}>
        {course} {subject} {code && <>({code})</>}
      </span>
    );
  }
  return (
    <div>
      <h3>{skill.description}</h3>
      <p>
        {skill.topic}: {syllabuses}
      </p>
      <button onClick={onClickView}>View</button>
    </div>
  );
}
