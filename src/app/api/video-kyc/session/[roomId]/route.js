import { NextResponse } from 'next/server';

import VideoKYCSession from '@/app/models/VideoKYCSession';
import { dbConnect } from '@/app/utils/dbConnect';

export async function GET(req, { params }) {
  await dbConnect();
  const { roomId } = params;

  const session = await VideoKYCSession.findOne({ roomId });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(session);
}
