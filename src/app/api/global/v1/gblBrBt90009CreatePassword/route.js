// import User from '@/app/models/user_table';
// import { dbConnect } from '@/app/utils/dbConnect';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// /**
//  * @swagger
//  * /api/global/v1/gblBrBt90009CreatePassword
//  *   post:
//  *     summary: Create a new password for an existing user
//  *     description: |
//  *       - Updates the user's password after OTP verification.
//  *       - Ensures strong password validation.
//  *       - Automatically logs in the user after password creation by generating a JWT token.
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 description: "New password meeting security criteria"
//  *                 example: "Secure@123"
//  *               confirmPassword:
//  *                 type: string
//  *                 format: password
//  *                 description: "Must match the password field"
//  *                 example: "Secure@123"
//  *     responses:
//  *       200:
//  *         description: Password created successfully and user logged in
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: string
//  *                   example: "6023_10"
//  *                 title:
//  *                   type: string
//  *                   example: "Password created successfully!"
//  *                 message:
//  *                   type: string
//  *                   example: "Password created successfully!"
//  *                 token:
//  *                   type: string
//  *                   description: "JWT token for automatic login"
//  *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//  *                 email:
//  *                   type: string
//  *                   format: email
//  *                   description: "User email"
//  *                   example: "user@example.com"
//  *                 role:
//  *                   type: string
//  *                   description: "User role (e.g., '02' for Admin)"
//  *                   example: "02"
//  *       400:
//  *         description: Bad request - missing or invalid fields
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: string
//  *                   example: "6023_8"
//  *                 title:
//  *                   type: string
//  *                   example: "User details missing"
//  *                 message:
//  *                   type: string
//  *                   example: "User email or role not found in cookies."
//  *       404:
//  *         description: User not found - registration required
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: string
//  *                   example: "6023_9"
//  *                 title:
//  *                   type: string
//  *                   example: "User not found"
//  *                 message:
//  *                   type: string
//  *                   example: "Please register first."
//  *       500:
//  *         description: Internal Server Error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: string
//  *                   example: "6023_11"
//  *                 title:
//  *                   type: string
//  *                   example: "Internal Server Error"
//  *                 message:
//  *                   type: string
//  *                   example: "Unexpected error occurred."
//  */

// // Helper function to validate password
// function validateInput(data) {
//   const errors = {};

//   if (!data.password || data.password.length < 8) {
//     errors.password = '6023_1 Password must be at least 8 characters.';
//   } else {
//     if (!/[A-Z]/.test(data.password)) {
//       errors.password = '6023_2 Password must contain at least one uppercase letter.';
//     }
//     if (!/[a-z]/.test(data.password)) {
//       errors.password = '6023_3 Password must contain at least one lowercase letter.';
//     }
//     if (!/\d/.test(data.password)) {
//       errors.password = '6023_4 Password must contain at least one number.';
//     }
//     if (!/[@$!%*?&]/.test(data.password)) {
//       errors.password = '6023_5 Password must contain at least one special character.';
//     }
//   }

//   if (!data.confirmPassword || data.confirmPassword !== data.password) {
//     errors.confirmPassword = '6023_7 Passwords must match.';
//   }

//   return errors;
// }

// // API route handler
// export async function POST(req) {
//   try {
//     const body = await req.json();

//     // Validate input
//     const errors = validateInput(body);
//     if (Object.keys(errors).length > 0) {
//       return NextResponse.json({ errors }, { status: 400 });
//     }

//     const cookieStore = await cookies();
//     const userEmail = cookieStore.get('user_email');
//     const userRole = cookieStore.get('user_role');

//     if (!userEmail || !userRole) {
//       return NextResponse.json(
//         { code: '6023_8', title: 'User details missing', message: 'User email or role not found in cookies.' },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const storedRole = userRole.value.toString(); // Ensure role is a string

//     // Find user using email & role
//     const existingUser = await User.findOne({
//       UT_Email: userEmail.value,
//       UT_User_Role: storedRole, // Ensure role comparison is string-based
//     });

//     if (!existingUser) {
//       return NextResponse.json(
//         { code: '6023_9', title: 'User not found', message: 'Please register first.' },
//         { status: 404 }
//       );
//     }

//     // Hash new password
//     const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
//     const hashedPassword = await bcrypt.hash(body.password, saltRounds);

//     // Update password and mark email as verified
//     existingUser.UT_Password = hashedPassword;
//     existingUser.UT_Email_Verified = '02'; // Mark as verified
//     await existingUser.save();

//     // Generate JWT token for automatic login
//     const token = jwt.sign(
//       {
//         id: existingUser._id.toString(),
//         email: existingUser.UT_Email,
//         role: storedRole, // Ensure role is string
//       },
//       process.env.NEXTAUTH_SECRET,
//       { expiresIn: '7d' }
//     );

//     //  Create response
//     const response = NextResponse.json(
//       {
//         code: '6023_10',
//         title: 'Password created successfully!',
//         message: 'Password created successfully!',
//         token,
//         email: existingUser.UT_Email,
//         role: storedRole,
//       },
//       { status: 200 }
//     );

//     //  Set secure cookies for authentication before returning the response
//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     response.cookies.set('user_email', existingUser.UT_Email, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     response.cookies.set('user_id', existingUser._id.toString(), {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     response.cookies.set('user_role', storedRole, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     return response;

//   } catch (error) {
//     console.error(' Unexpected Error:', error.message);
//     return NextResponse.json(
//       { code: '6023_11', title: 'Internal Server Error', message: error.message },
//       { status: 500 }
//     );
//   }
// }

import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/global/v1/gblBrBt90009CreatePassword
 *   post:
 *     summary: Create a new password for an existing user
 *     description: |
 *       - Updates the user's password after OTP verification.
 *       - Ensures strong password validation.
 *       - Automatically logs in the user after password creation by generating a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: "New password meeting security criteria"
 *                 example: "Secure@123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: "Must match the password field"
 *                 example: "Secure@123"
 *     responses:
 *       200:
 *         description: Password created successfully and user logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6023_10"
 *                 title:
 *                   type: string
 *                   example: "Password created successfully!"
 *                 message:
 *                   type: string
 *                   example: "Password created successfully!"
 *                 token:
 *                   type: string
 *                   description: "JWT token for automatic login"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: "User email"
 *                   example: "user@example.com"
 *                 role:
 *                   type: string
 *                   description: "User role (e.g., '02' for Admin)"
 *                   example: "02"
 *       400:
 *         description: Bad request - missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6023_8"
 *                 title:
 *                   type: string
 *                   example: "User details missing"
 *                 message:
 *                   type: string
 *                   example: "User email or role not found in cookies."
 *       404:
 *         description: User not found - registration required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6023_9"
 *                 title:
 *                   type: string
 *                   example: "User not found"
 *                 message:
 *                   type: string
 *                   example: "Please register first."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6023_11"
 *                 title:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "Unexpected error occurred."
 */

// Helper function to validate password
function validateInput(data) {
  const errors = {};

  if (!data.password || data.password.length < 8) {
    errors.password = "6023_1 Password must be at least 8 characters.";
  } else {
    if (!/[A-Z]/.test(data.password)) {
      errors.password =
        "6023_2 Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(data.password)) {
      errors.password =
        "6023_3 Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(data.password)) {
      errors.password = "6023_4 Password must contain at least one number.";
    }
    if (!/[@$!%*?&]/.test(data.password)) {
      errors.password =
        "6023_5 Password must contain at least one special character.";
    }
  }

  if (!data.confirmPassword || data.confirmPassword !== data.password) {
    errors.confirmPassword = "6023_7 Passwords must match.";
  }

  return errors;
}

// API route handler
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input
    const errors = validateInput(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email");
    const userRole = cookieStore.get("user_role");

    if (!userEmail || !userRole) {
      return NextResponse.json(
        {
          code: "6023_8",
          title: "User details missing",
          message: "User email or role not found in cookies.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const storedRole = userRole.value.toString(); // Ensure role is a string

    // Find user using email & role
    const existingUser = await User.findOne({
      UT_Email: userEmail.value,
      UT_User_Role: storedRole, // Ensure role comparison is string-based
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          code: "6023_9",
          title: "User not found",
          message: "Please register first.",
        },
        { status: 404 }
      );
    }

    // Hash new password
    const saltRounds =
      Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // Update password and mark email as verified
    existingUser.UT_Password = hashedPassword;
    existingUser.UT_Email_Verified = "02"; // Mark as verified
    await existingUser.save();

    // Generate JWT token for automatic login
    const token = jwt.sign(
      {
        id: existingUser._id.toString(),
        email: existingUser.UT_Email,
        role: storedRole, // Ensure role is string
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "7d" }
    );

    //  Create response
    const response = NextResponse.json(
      {
        code: "6023_10",
        title: "Password created successfully!",
        message: "Password created successfully!",
        token,
        email: existingUser.UT_Email,
        role: storedRole, // This role will be used for role-based redirection on the client
      },
      { status: 200 }
    );

    //  Set secure cookies for authentication before returning the response
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("user_email", existingUser.UT_Email, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("user_id", existingUser._id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("user_role", storedRole, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error(" Unexpected Error:", error.message);
    return NextResponse.json(
      {
        code: "6023_11",
        title: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
