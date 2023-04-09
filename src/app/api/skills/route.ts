import { NextResponse } from 'next/server';

import client from '../lib/mongoClient';

export async function GET(request: Request) {
  const data = await client
    .db('math-roadmap-main')
    .collection('skills')
    .find({})
    .toArray();
  return NextResponse.json(data);
}
