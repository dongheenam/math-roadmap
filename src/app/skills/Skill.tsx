'use client';

import { PlainSkill } from '../types/skills';

type Props = {
  skill: PlainSkill;
};
export default function Skills({ skill }: Props) {
  return (
    <div>
      <h2>{skill.description}</h2>
      <p>Appears in:</p>
      <ul>
        {skill.syllabus.AC && <li>AC {skill.syllabus.AC.subject}</li>}
        {skill.syllabus.HSC && <li>HSC {skill.syllabus.HSC.subject}</li>}
        {skill.syllabus.IB && <li>IB {skill.syllabus.IB.subject}</li>}
      </ul>
      <p>Prerequisites: {JSON.stringify(skill.prerequisiteIds)}</p>
      <p>Practice questions:</p>
      <ol>
        {skill.exampleQuestions.map((item, i) => (
          <li key={i}>
            {item.question} {item.answer}
          </li>
        ))}
      </ol>
    </div>
  );
}
