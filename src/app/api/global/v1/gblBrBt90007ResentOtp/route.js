import User from '@/app/models/user_table';
import OTPVerification from '@/app/models/otp_verification';
import { dbConnect } from '@/app/utils/dbConnect';
import { sendEmail } from '@/app/utils/SendMail';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/global/v1/gblBrBt90007ResentOtp:
 *   post:
 *     summary: Resend OTP to registered email
 *     description: |
 *       - Resends a new 4-digit OTP to the user's registered email.
 *       - Requires email (from cookies or request body) and role.
 *       - Updates the OTP record and sends the new OTP via email.
 *     tags: [OTP Resend For All Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               role:
 *                 type: string
 *                 example: "06"
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6022_4"
 *                 title:
 *                   type: string
 *                   example: "OTP Resent Successfully"
 *                 message:
 *                   type: string
 *                   example: "6022_4 OTP resent successfully. Please check your email."
 *       400:
 *         description: Missing email in request or cookies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6022_1"
 *                 title:
 *                   type: string
 *                   example: "Email not found"
 *                 message:
 *                   type: string
 *                   example: "6022_1 User email not found in cookies or request body."
 *       404:
 *         description: User not found in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6022_2"
 *                 title:
 *                   type: string
 *                   example: "User not found"
 *                 message:
 *                   type: string
 *                   example: "6022_2 User not found. Please register first."
 *       500:
 *         description: Failed to send OTP or unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_3"
 *                     title:
 *                       type: string
 *                       example: "Failed to send OTP email"
 *                     message:
 *                       type: string
 *                       example: "6022_3 Failed to send OTP email. Please try again later."
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_5"
 *                     title:
 *                       type: string
 *                       example: "Internal server error"
 *                     message:
 *                       type: string
 *                       example: "6022_5 An unexpected error occurred. Please try again."
 */


export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { email: requestEmail, role: requestRole } = requestBody;
    const cookieStore = cookies();
    const userEmails = await cookieStore.get('user_email');
    let email = userEmails ? userEmails.value : requestEmail;

    if (!email) {
      return NextResponse.json(
        {
          code: '6022_1',
          title: 'Email not found',
          message: '6022_1 User email not found in cookies or request body.',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user in the database using email and role
    const existingUser = await User.findOne({
      UT_Email: email,
      // UT_User_Role: requestRole,
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          code: '6022_2',
          title: 'User not found',
          message: '6022_2 User not found. Please register first.',
        },
        { status: 404 }
      );
    }

    // Generate a new 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // valid for 10 minutes

    // Find existing OTP record
    let otpRecord = await OTPVerification.findOne({ OV_User_Id: existingUser._id });

    if (otpRecord) {
      // Update existing record
      otpRecord.OV_OTP = Number(otp);
      otpRecord.OV_OTP_Expiry = otpExpiry;
      otpRecord.OV_Resend_Count += 1;
      otpRecord.OV_Updated_At = new Date();
      await otpRecord.save();
    } else {
      // Create new record
      otpRecord = new OTPVerification({
        OV_User_Id: existingUser._id,
        OV_Email: email,
        OV_OTP: Number(otp),
        OV_OTP_Expiry: otpExpiry,
        OV_Resend_Count: 1
      });
      await otpRecord.save();
    }

    // Send the new OTP via email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Your New OTP',
      text: `Your new One Time Password (OTP) is ${otp}. It is valid for 10 minutes.`,
    });

    if (!emailSent) {
      return NextResponse.json(
        {
          code: '6022_3',
          title: 'Failed to send OTP email',
          message: '6022_3 Failed to send OTP email. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        code: '6022_4',
        title: 'OTP Resent Successfully',
        message: '6022_4 OTP resent successfully. Please check your email.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resending OTP:', error);
    return NextResponse.json(
      {
        code: '6022_5',
        title: 'Internal server error',
        message: '6022_5 An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}