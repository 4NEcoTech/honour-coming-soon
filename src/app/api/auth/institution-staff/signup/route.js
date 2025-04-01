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
 * /api/auth/institution-staff/signup:
 *   post:
 *     summary: Register Institution Team/Staff and send OTP
 *     description: |
 *       - Handles signup for Institution Team (07) or Institution Staff (08) using email.
 *       - Validates email format and ensures correct role.
 *       - Prevents signup if already registered with a different role.
 *       - Sends a 4-digit OTP to the user's email.
 *       - JWT token and user info are returned and stored in secure HTTP-only cookies.
 *     tags: [Institution Staff, Team and Company Staff, Team Registration]
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
 *                 example: "institution.staff@example.com"
 *               role:
 *                 type: string
 *                 enum: ["07", "08"]
 *                 example: "07"
 *     responses:
 *       201:
 *         description: Institution Team/Staff registered and OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6021_4"
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
 *                       example: "institution.staff@example.com"
 *                     UT_User_Role:
 *                       type: string
 *                       example: "07"
 *                     UT_Email_Verified:
 *                       type: string
 *                       nullable: true
 *                       example: "03"
 *                     UT_Login_Type:
 *                       type: string
 *                       example: "02"
 *       400:
 *         description: Missing email or role, invalid role or email format
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Email and role are required."
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid role. Only 07 (Institution Team) or 08 (Institution Staff) are allowed."
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
 *                       example: "6021_7"
 *                     title:
 *                       type: string
 *                       example: "User Already Registered with a Different Role"
 *                     message:
 *                       type: string
 *                       example: "This email is already registered with role ID 06. Cannot sign up as Institution Team/Staff."
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6021_5"
 *                     title:
 *                       type: string
 *                       example: "Email Already Registered"
 *                     message:
 *                       type: string
 *                       example: "This email address is already registered. Please login."
 *                     link:
 *                       type: string
 *                       example: "/en/login6035"
 *       500:
 *         description: Internal server error or email send failure
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6021_3"
 *                     title:
 *                       type: string
 *                       example: "OTP Email Failed"
 *                     message:
 *                       type: string
 *                       example: "Failed to send OTP email. Please try again later."
 *                 - properties:
 *                     code:
 *                       type: string
 *                       example: "6021_6"
 *                     title:
 *                       type: string
 *                       example: "Internal Server Error"
 *                     message:
 *                       type: string
 *                       example: "Something went wrong."
 */


const generateJwtToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.UT_User_Id, role: user.UT_User_Role },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: '1d' }
  );
};

const generateOtp = () => {
  return crypto.randomInt(1000, 9999);
};

export const POST = async (request) => {
  const locale = request.headers.get('accept-language') || 'en';
  console.log(`Locale detected: ${locale}`);

  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email and role are required.' },
        { status: 400 }
      );
    }

    // Validate role (only 07 or 08 are allowed)
    if (!['07', '08'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role. Only 07 (Institution Team) or 08 (Institution Staff) are allowed.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    await dbConnect();

    let user = await User.findOne({ UT_User_Id: email });

    // If user exists, check role compatibility
    if (user) {
      if (user.UT_User_Role !== role) {
        return NextResponse.json(
          {
            code: '6021_7',
            title: 'User Already Registered with a Different Role',
            message: `This email is already registered with role ID ${user.UT_User_Role}. Cannot sign up as Institution Team/Staff.`,
          },
          { status: 409 }
        );
      }

      if (user.UT_Email_Verified === '02') {
        return NextResponse.json(
          {
            code: '6021_5',
            title: 'Email Already Registered',
            message: 'This email address is already registered. Please login.',
            link: '/en/login6035',
          },
          { status: 409 }
        );
      }
    }

    // Generate OTP & Audit Trail
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
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
          code: '6021_3',
          title: 'OTP Email Failed',
          message: 'Failed to send OTP email. Please try again later.',
        },
        { status: 500 }
      );
    }

    // Create or update user in DB
    if (!user) {
      user = new User({
        UT_User_Id: email,
        UT_User_Role: role, // Assign role dynamically (07 or 08)
        UT_Login_Type: '02',
        UT_Audit_Trail: [auditTrail],
      });
      await user.save();
    }

    // Create or update OTP in verification table
    const otpRecord = await OTPVerification.findOneAndUpdate(
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

    // Set token as an HTTP-only, secure cookie
    const response = NextResponse.json(
      {
        code: '6021_4',
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
        code: '6021_6',
        title: 'Internal Server Error',
        message: error.message || 'Something went wrong.',
      },
      { status: 500 }
    );
  }
};