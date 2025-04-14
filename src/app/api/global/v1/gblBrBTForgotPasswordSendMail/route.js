import User from '@/app/models/user_table';
import OTPVerification from '@/app/models/otp_verification';
import { dbConnect } from '@/app/utils/dbConnect';
import { sendEmail } from '@/app/utils/SendMail';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/global/v1/gblBrBTForgotPasswordSendMail:
 *   post:
 *     summary: Forgot Password - Send OTP
 *     description: |
 *       - Initiates the forgot password process by generating and emailing an OTP to the user's registered email.
 *       - Verifies if the email exists in the system.
 *       - Stores or updates OTP details with expiration.
 *     tags: [Forgot Password For All Users]
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
 *     responses:
 *       200:
 *         description: OTP sent successfully to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "6036_4 Otp sent successfully."
 *                 title:
 *                   type: string
 *                   example: "Otp sent"
 *                 code:
 *                   type: string
 *                   example: "6036_4"
 *                 userId:
 *                   type: string
 *                   example: "65f478f8cc455f0012548fdf"
 *       400:
 *         description: Missing or invalid input, or user not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "6036_2 User email not found."
 *                     title:
 *                       type: string
 *                       example: "email not found"
 *                     code:
 *                       type: string
 *                       example: "6036_2"
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User not found."
 *                     title:
 *                       type: string
 *                       example: "User not found"
 *                     code:
 *                       type: string
 *                       example: "6036_6"
 *       500:
 *         description: Server or OTP/email related error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "6036_3 Unable to generate OTP. Please try again later."
 *                     title:
 *                       type: string
 *                       example: "OTP generation failed"
 *                     code:
 *                       type: string
 *                       example: "6036_3"
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "6036_5 An error occurred while processing forgot password request."
 *                     title:
 *                       type: string
 *                       example: "error"
 *                     code:
 *                       type: string
 *                       example: "6036_5"
 */


export async function POST(req) {
  try {
    // console.log('Forgot Password API called');
    const body = await req.json();
    // console.log('Forgot Password API body:', body);

    if (!body.email) {
      return NextResponse.json(
        {
          message: '6036_2 User email not found.',
          title: 'email not found',
          code: '6036_2',
        },
        { status: 400 }
      );
    }


    await dbConnect();

    const existingUser = await User.findOne({ UT_User_Id: body.email });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'User not found.',
          title: 'User not found',
          code: '6036_6'
        },
        { status: 400 }
      );
    }

    // Generate OTP
    let otp;
    try {
      otp = Math.floor(1000 + Math.random() * 9000);
    } catch (error) {
      console.error('OTP generation failed:', error);
      return NextResponse.json(
        {
          message: '6036_3 Unable to generate OTP. Please try again later.',
          title: 'OTP generation failed',
          code: '6036_3',
        },
        { status: 500 }
      );
    }

    // Send OTP email
    const emailSent = await sendEmail({
      to: body.email,
      subject: 'Forgot Password OTP',
      text: `Your One Time Password is ${otp}. Do not share it with anyone!`,
    });

    if (!emailSent) {
      return NextResponse.json(
        {
          message: '6036_3 Failed to send OTP email. Please try again later.',
          title: 'OTP generation failed',
          code: '6036_3',
        },
        { status: 500 }
      );
    }

    const expDate = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // Create or update OTP in verification table
    const otpRecord = await OTPVerification.findOneAndUpdate(
      { OV_User_Id: existingUser._id },
      {
        OV_Email: body.email,
        OV_OTP: otp,
        OV_OTP_Expiry: expDate,
        OV_Updated_At: new Date(),
        $inc: { OV_Resend_Count: 1 }
      },
      {  upsert: true, new: true }
    );

        const response = NextResponse.json(
          {
            message: "6036_4 Otp sent successfully.",
            title: "Otp sent",
            code: "6036_4",
            userId: existingUser._id, // Return user ID for reference
          },
          { status: 200 }
        );

      // Set a secure, HTTP-only cookie with the user's email
      response.cookies.set("user_email", existingUser.UT_Email, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Ensures the cookie is sent only over HTTPS
        sameSite: "strict", // Restricts the cookie to same-site requests
        path: "/", // Makes the cookie available across the entire site
        maxAge: 60 * 60 * 24 * 30, // Sets the cookie to expire in 30 days
      });

      // Set a secure, HTTP-only cookie with the user's email
      response.cookies.set("user_role", existingUser.UT_User_Role, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Ensures the cookie is sent only over HTTPS
        sameSite: "strict", // Restricts the cookie to same-site requests
        path: "/", // Makes the cookie available across the entire site
        maxAge: 60 * 60 * 24 * 30, // Sets the cookie to expire in 30 days
      });

return response;
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    return NextResponse.json(
      {
        message: '6036_5 An error occurred while processing forgot password request.',
        title: 'error',
        code: '6036_5',
      },
      { status: 500 }
    );
  }
}
