import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/mobile/online-offline:
 *   post:
 *     summary: Set user online/offline status
 *     description: >
 *       Updates the in-memory user status to `"online"` or `"offline"`.  
 *       This is a temporary, non-persistent mechanism (resets on server restart).
 *     tags:
 *       - Mobile Online Offline Api
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [online, offline]
 *                 example: online
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status updated
 *                 status:
 *                   type: string
 *                   example: online
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid status
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 *   get:
 *     summary: Get current user status (online/offline)
 *     description: >
 *       Returns the current value of the in-memory user status flag.
 *     tags:
 *       - Mobile Utility
 *     responses:
 *       200:
 *         description: Current status fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: online
 */


// In-memory store (temporary)
let userStatus = "offline"; // Default initially

export async function POST(request) {
  try {
    const body = await request.json();
    const { status } = body;

    if (status !== "online" && status !== "offline") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    userStatus = status; // Update the status
    return NextResponse.json({ message: "Status updated", status: userStatus });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/mobile/online-offline
export async function GET() {
  return NextResponse.json({ status: userStatus });
}
