import OTPVerification from "@/app/models/otp_verification";
import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/global/v1/gblBrBt90008VerifyOtp:
 *   post:
 *     summary: Verify OTP for email and role
 *     description: |
 *       - Verifies the 4-digit OTP sent to a user's email.
 *       - Checks email and role from cookies or request body.
 *       - Confirms OTP validity and expiration.
 *       - Updates user's email verification status on success.
 *     tags: [OTP Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["1", "2", "3", "4"]
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               role:
 *                 type: string
 *                 example: "06"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6022_11"
 *                 title:
 *                   type: string
 *                   example: "OTP verified successfully."
 *                 message:
 *                   type: string
 *                   example: "6022_11 OTP verified successfully."
 *       400:
 *         description: Bad request - missing or invalid data, expired or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_6"
 *                     title:
 *                       type: string
 *                       example: "Email not found"
 *                     message:
 *                       type: string
 *                       example: "6022_6 User email not found in cookies or request body."
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_13"
 *                     title:
 *                       type: string
 *                       example: "User role not found"
 *                     message:
 *                       type: string
 *                       example: "6022_13 User role not found in cookies or request body."
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_7"
 *                     title:
 *                       type: string
 *                       example: "Invalid OTP format"
 *                     message:
 *                       type: string
 *                       example: "6022_7 Invalid OTP format. Must be a 4-digit number."
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_9"
 *                     title:
 *                       type: string
 *                       example: "OTP expired!"
 *                     message:
 *                       type: string
 *                       example: "6022_9 OTP has expired. Please request a new one."
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_10"
 *                     title:
 *                       type: string
 *                       example: "Invalid OTP."
 *                     message:
 *                       type: string
 *                       example: "6022_10 Invalid OTP. Please try again."
 *       404:
 *         description: User or OTP record not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_8"
 *                     title:
 *                       type: string
 *                       example: "User not found."
 *                     message:
 *                       type: string
 *                       example: "6022_8 User not found. Please register first."
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "6022_14"
 *                     title:
 *                       type: string
 *                       example: "OTP not found"
 *                     message:
 *                       type: string
 *                       example: "6022_14 No OTP record found for this user."
 *       500:
 *         description: Internal server error during OTP verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6022_12"
 *                 title:
 *                   type: string
 *                   example: "Error verifying OTP"
 *                 message:
 *                   type: string
 *                   example: "6022_12 An unexpected error occurred: [error details]"
 */

export async function POST(request) {
  const locale = request.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);

  try {
    const requestBody = await request.json();
    const { otp, email: requestEmail, role: requestRole } = requestBody;

    const cookieStore = await cookies();
    const userEmailCookie = cookieStore.get("user_email");
    const userRoleCookie = cookieStore.get("user_role");
    let email = userEmailCookie ? userEmailCookie.value : requestEmail;
    let role = requestRole || (userRoleCookie ? userRoleCookie.value : null);

    if (!email) {
      return NextResponse.json(
        {
          code: "6022_6",
          title: t(`errorCode.6022_6.title`),
          message: t(`errorCode.6022_6.description`),
        },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        {
          code: "6022_13",
          title: t(`errorCode.6022_13.title`),
          message: t(`errorCode.6022_13.description`),
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(otp)) {
      return NextResponse.json(
        {
          code: "6022_5",
          title: t(`errorCode.6022_5.title`),
          message: t(`errorCode.6022_5.description`),
        },
        { status: 400 }
      );
    }

    const OTP = otp.join("");
    if (!OTP || !/^\d{4}$/.test(OTP)) {
      return NextResponse.json(
        {
          code: "6022_7",
          title: t(`errorCode.6022_7.title`),
          message: t(`errorCode.6022_7.description`),
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({
      UT_Email: email,
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          code: "6022_8",
          title: t(`errorCode.6022_8.title`),
          message: t(`errorCode.6022_8.description`),
        },
        { status: 404 }
      );
    }

    // Get OTP record from verification table
    const otpRecord = await OTPVerification.findOne({
      OV_Email: email,
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          code: "6022_14",
          title: t(`errorCode.6022_14.title`),
          message: t(`errorCode.6022_14.description`),
        },
        { status: 404 }
      );
    }

    // Check OTP expiration
    const currentTime = new Date();
    if (
      !otpRecord.OV_OTP_Expiry ||
      new Date(otpRecord.OV_OTP_Expiry) < currentTime
    ) {
      return NextResponse.json(
        {
          code: "6022_9",
          title: t(`errorCode.6022_9.title`),
          message: t(`errorCode.6022_9.description`),
        },
        { status: 400 }
      );
    }

    // Validate OTP
    const isOtpValid = otpRecord.OV_OTP.toString() === String(OTP);
    if (!isOtpValid) {
      return NextResponse.json(
        {
          code: "6022_10",
          title: t(`errorCode.6022_10.title`),
          message: t(`errorCode.6022_10.description`),
        },
        { status: 400 }
      );
    }

    // Clear OTP record upon successful validation
    await OTPVerification.deleteOne({ _id: otpRecord._id });

    // Update user's email verification status
    await User.updateOne(
      { _id: existingUser._id },
      { $set: { UT_Email_Verified: "02" } }
    );

    return NextResponse.json(
      {
        code: "6022_11",
        title: t(`errorCode.6022_11.title`),
        message: t(`errorCode.6022_11.description`),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        code: "6022_12",
        title: t(`errorCode.6022_12.title`),
        message: t(`errorCode.6022_12.description`, { message: error.message }),
      },
      { status: 500 }
    );
  }
}
