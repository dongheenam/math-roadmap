import getUnitById from '../lib/getUnitById';

type Props = {
  params: { _id: string };
};

export default async function Page({ params }: Props) {
  const _id = params._id;
  const unit = await getUnitById(_id);
  if (!unit) {
    throw new Error('Unit not found!');
  }

  return (
    <main>
      <h2>Unit: {unit.name}</h2>
      <p>
        For {unit.course} {unit.subject} ({unit.topic})
      </p>
      <p>Syllabus points:</p>
      <ul>
        {unit.codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <p>Skill list in order:</p>
    </main>
  );
}
