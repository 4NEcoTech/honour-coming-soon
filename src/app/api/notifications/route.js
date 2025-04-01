import { NextResponse } from 'next/server';
import Notification from '../../models/Notification';
import { dbConnect } from '../../utils/dbConnect';

export async function GET() {
  await dbConnect();

  try {
    const notifications = await Notification.find({
      recipientRole: "02", // Super Admin
      isRead: false,       // Only unread notifications
    }).sort({ createdAt: -1 }); // Latest first

    
    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching notifications',
    }, { status: 500 });
  }
}
