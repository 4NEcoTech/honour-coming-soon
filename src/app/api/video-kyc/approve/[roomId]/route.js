import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/utils/dbConnect';
import VideoKYCSession from '@/app/models/VideoKYCSession';

export async function POST(req, { params }) {
  await dbConnect();
  const { roomId } = params;
  const { status } = await req.json(); // "approved" or "rejected"

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const session = await VideoKYCSession.findOneAndUpdate(
    { roomId },
    { status },
    { new: true }
  );

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ message: `KYC ${status} successfully` });
}
