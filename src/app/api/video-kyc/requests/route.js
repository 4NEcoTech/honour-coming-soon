import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/utils/dbConnect';
import VideoKYCSession from '@/app/models/VideoKYCSession';

export async function GET() {
  await dbConnect();

  // Fetch all pending KYC requests
  const sessions = await VideoKYCSession.find({ status: 'pending' });

  return NextResponse.json(sessions);
}
