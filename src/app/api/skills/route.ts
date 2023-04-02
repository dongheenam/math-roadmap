import { NextResponse } from 'next/server';

import clientPromise from '../lib/mongodb';

export async function GET(request: Request) {
  const client = await clientPromise;
  const data = await client
    .db('math-roadmap-main')
    .collection('skills')
    .find({})
    .toArray();
  return NextResponse.json(data);
}
