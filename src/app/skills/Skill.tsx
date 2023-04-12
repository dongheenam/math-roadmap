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
