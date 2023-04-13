import searchSkills from '@/app/skills/lib/searchSkills';
import getUnitById from '../lib/getUnitById';
import SkillsList from '@/app/skills/SkillsList';

type Props = {
  params: { _id: string };
};

export default async function Page({ params }: Props) {
  const _id = params._id;
  const unit = await getUnitById(_id);
  if (!unit) {
    throw new Error('Unit not found!');
  }

  const skills = await searchSkills({ code: unit.codes });

  return (
    <main>
      <h2>Unit: {unit.name}</h2>
      <p>
        For {unit.course} {unit.subject} ({unit.topic})
      </p>
      <h3>Syllabus points</h3>
      <ul>
        {unit.codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <h3>Skills</h3>
      <SkillsList skills={skills} />
    </main>
  );
}
