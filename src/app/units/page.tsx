import Link from 'next/link';
import units from './lib/units';

export default function Page() {
  return (
    <main>
      <h1>Unit Builder</h1>
      <p>You can view the list of skills in a unit.</p>
      <p>Select a unit from the list below.</p>
      <ol>
        {units.map((unit) => (
          <li key={unit._id}>
            <Link href={`/units/${unit._id}`}>
              ({unit.course} {unit.subject} / {unit.topic}) {unit.name}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
