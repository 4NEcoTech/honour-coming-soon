import User from '@/app/models/user_table';
import OTPVerification from '@/app/models/otp_verification';
import { dbConnect } from '@/app/utils/dbConnect';
import { sendEmail } from '@/app/utils/SendMail';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { generateAuditTrail } from '@/app/utils/audit-trail';

/**
 * @swagger
 * /api/auth/institution/signup:
 *   post:
 *     summary: Register Institution and send OTP
 *     description: |
 *       - Handles signup for Institution role (06) using email.
 *       - Validates email format.
 *       - Blocks registration if already registered with a different role or already verified.
 *       - Sends a 4-digit OTP to the user's email address.
 *       - Stores JWT token and user info in secure HTTP-only cookies.
 *     tags: [Institution Registration]
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
 *                 example: "institution@example.com"
 *     responses:
 *       201:
 *         description: Institution user registered and OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6091_4"
 *                 title:
 *                   type: string
 *                   example: "OTP Sent"
 *                 message:
 *                   type: string
 *                   example: "An OTP has been sent to your email address."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f7e8c36a254d0012f65fbb"
 *                     UT_User_Id:
 *                       type: string
 *                       example: "institution@example.com"
 *                     UT_User_Role:
 *                       type: string
 *                       example: "06"
 *                     UT_Email_Verified:
 *                       type: string
 *                       nullable: true
 *                       example: "03"
 *                     UT_Login_Type:
 *                       type: string
 *                       example: "02"
 *       400:
 *         description: Missing or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Email is required."
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid email format."
 *       409:
 *         description: User already registered with different role or verified
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6091_7"
 *                     title:
 *                       type: string
 *                       example: "User Already Registered with a Different Role"
 *                     message:
 *                       type: string
 *                       example: "This email is already registered with role ID 07. Cannot sign up as Institution."
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6091_5"
 *                     title:
 *                       type: string
 *                       example: "Email Already Registered"
 *                     message:
 *                       type: string
 *                       example: "This email address is already registered. Please login."
 *                     link:
 *                       type: string
 *                       example: "/login"
 *       500:
 *         description: Internal server error or OTP email failure
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6091_3"
 *                     title:
 *                       type: string
 *                       example: "OTP Email Failed"
 *                     message:
 *                       type: string
 *                       example: "Failed to send OTP email. Please try again later."
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6091_6"
 *                     title:
 *                       type: string
 *                       example: "Internal Server Error"
 *                     message:
 *                       type: string
 *                       example: "Something went wrong."
 */


/**
 * Generates a JWT token for authenticated users.
 */
const generateJwtToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.UT_User_Id, role: user.UT_User_Role },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: '1d' }
  );
};

/**
 * Generates a secure 4-digit OTP.
 */
const generateOtp = () => {
  return crypto.randomInt(1000, 9999);
};

export const POST = async (request) => {
  const locale = request.headers.get('accept-language') || 'en';
  console.log(`Locale detected: ${locale}`);

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    await dbConnect();

    let user = await User.findOne({ UT_User_Id: email });

    // If user exists, check role compatibility and verification status
    if (user) {
      if (user.UT_User_Role !== "06") {
        return NextResponse.json(
          {
            code: '6091_7',
            title: 'User Already Registered with a Different Role',
            message: `This email is already registered with role ID ${user.UT_User_Role}. Cannot sign up as Institution.`,
          },
          { status: 409 }
        );
      }

      if (user.UT_Email_Verified === '02') {
        return NextResponse.json(
          {
            code: '6091_5',
            title: 'Email Already Registered',
            message: 'This email address is already registered. Please login.',
            link: '/login',
          },
          { status: 409 }
        );
      }
    }

    // Generate OTP & Audit Trail
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const auditTrail = await generateAuditTrail(request);

    // Send OTP email
    const emailSent = await sendEmail({
      to: email,
      subject: `Welcome to HCJ - Institution Signup`,
      text: `Your One Time Password is ${otp}. Do not share it with anyone!`,
    });

    if (!emailSent) {
      return NextResponse.json(
        {
          code: '6091_3',
          title: 'OTP Email Failed',
          message: 'Failed to send OTP email. Please try again later.',
        },
        { status: 500 }
      );
    }

    // Create or update user in DB (without OTP fields)
    if (!user) {
      user = new User({
        UT_User_Id: email,
        UT_User_Role: '06', // Assign role "06" for Institution
        UT_Login_Type: '02',
        UT_Audit_Trail: [auditTrail],
      });
      await user.save();
    }

    // Create or update OTP in verification table
    await OTPVerification.findOneAndUpdate(
      { OV_User_Id: user._id },
      {
        OV_Email: email,
        OV_OTP: Number(otp),
        OV_OTP_Expiry: otpExpiry,
        OV_Updated_At: new Date()
      },
      { upsert: true, new: true }
    );

    // Generate JWT Token
    const token = generateJwtToken(user);

    // Create the response and set cookies
    const response = NextResponse.json(
      {
        code: '6091_4',
        title: 'OTP Sent',
        message: 'An OTP has been sent to your email address.',
        token,
        user: {
          _id: user._id,
          UT_User_Id: user.UT_User_Id,
          UT_User_Role: user.UT_User_Role,
          UT_Email_Verified: user.UT_Email_Verified,
          UT_Login_Type: user.UT_Login_Type,
        },
      },
      { status: 201 }
    );

    response.headers.set(
      'Set-Cookie',
      [
        `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24}`,
        `user_email=${email}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24}`,
        `user_id=${user._id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24}`,
        `user_role=${user.UT_User_Role}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24}`,
      ].join(', ')
    );

    return response;
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        code: '6091_6',
        title: 'Internal Server Error',
        message: error.message || 'Something went wrong.',
      },
      { status: 500 }
    );
  }
};