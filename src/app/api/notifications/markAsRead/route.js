import { NextResponse } from 'next/server';
import Notification from '../../../models/Notification';
import { dbConnect } from '../../../utils/dbConnect';

export async function POST() {
  await dbConnect();

  try {
    await Notification.updateMany(
      { recipientRole: "02", isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ success: false, message: 'Error updating notifications' }, { status: 500 });
  }
}
