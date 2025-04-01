import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/utils/dbConnect';
import VideoKYCSession from '@/app/models/VideoKYCSession';

export async function POST(req) {
  await dbConnect();
  const { userId } = await req.json(); // Get userId from request

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const roomId = `kyc-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const session = new VideoKYCSession({
    userId,
    roomId,
    status: 'pending',
  });

  await session.save();

  return NextResponse.json({ roomId }, { status: 201 });
}
