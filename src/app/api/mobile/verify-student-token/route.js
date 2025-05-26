import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Student from "@/app/models/hcj_student";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/mobile/auth/verify-student-token:
 *   post:
 *     summary: Verify mobile JWT token and return student data
 *     description: >
 *       Verifies a JWT token issued for the mobile app.  
 *       Checks for the `mobileApp` flag in the token payload and confirms that the student exists in the database.  
 *       On success, returns decoded student data (excluding sensitive JWT metadata).
 *     tags:
 *       - Verifiy invited Student Token For Mobile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token to verify
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *     responses:
 *       200:
 *         description: Token verified and student data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   type: object
 *                   description: Token payload (excluding iat/exp)
 *       400:
 *         description: Token missing from request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token is required
 *       401:
 *         description: Token invalid, expired, or not for mobile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token signature
 *       404:
 *         description: Student ID from token not found in DB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student not found
 */


export async function POST(req) {
  try {
    await dbConnect();
    
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify this is a mobile token
    if (!decoded.mobileApp) {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      );
    }

    // Verify student exists (security check)
    const studentExists = await Student.exists({ _id: decoded.id });
    if (!studentExists) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Return ALL data from token (excluding sensitive JWT fields)
    const { iat, exp, ...tokenData } = decoded;
    
    return NextResponse.json({
      success: true,
      student: tokenData // Returns complete student data from token
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    
    let errorMessage = "Invalid token";
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token signature";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}