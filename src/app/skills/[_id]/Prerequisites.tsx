'use client';

import { useState } from 'react';
import Link from 'next/link';

import { PlainSkill } from '@/app/types/skills';

type Props = { _id: string };
type SkillWithDepth = PlainSkill & { depth: number };

export default function Prerequisites({ _id }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [prerequisites, setPrerequisites] = useState<SkillWithDepth[]>([]);

  const load = async () => {
    if (loaded) return;
    const res = await fetch(`/api/skills/${_id}/prerequisites`);

    if (!res.ok) {
      throw new Error('Failed to load prerequisites');
    }

    // Easier skills have a higher depth
    const data = (await res.json()) as SkillWithDepth[];
    setPrerequisites(data.sort((a, b) => b.depth - a.depth));
    setLoaded(true);
  };

  const prerequisitesView =
    prerequisites.length === 0 ? (
      <p>No prerequisites!</p>
    ) : (
      prerequisites.map((skill) => (
        <li key={skill._id}>
          <Link href={`/skills/${skill._id}`}>{skill.description}</Link>
        </li>
      ))
    );

  return (
    <>
      <h3>Prerequisites</h3>
      {!loaded && <button onClick={() => load()}>Load</button>}
      <ol>{loaded && prerequisitesView}</ol>
    </>
  );
}
