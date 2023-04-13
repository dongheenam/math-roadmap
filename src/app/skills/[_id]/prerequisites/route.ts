import { NextResponse } from 'next/server';

import getPrerequisiteSkills from '@/app/skills/lib/getPrerequisiteSkills';

type Context = {
  params: { _id: string };
};
export async function GET(request: Request, { params }: Context) {
  const { _id } = params;

  const prerequisites = await getPrerequisiteSkills(_id);

  return NextResponse.json(prerequisites);
}
