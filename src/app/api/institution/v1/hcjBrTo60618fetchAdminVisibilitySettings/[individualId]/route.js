import { NextResponse } from "next/server";
import IndividualVisibility from "@/app/models/individual_info_visibility";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60618fetchAdminVisibilitySettings/{individualId}:
 *   get:
 *     summary: Get student visibility preferences
 *     description: >
 *       Retrieves the current public visibility settings for the given student  
 *       using their `individualId` (`IIV_Individual_Id` in the database).
 *     tags:
 *       - Get Admin Public Profile VIsibiity Setting
 *     parameters:
 *       - in: path
 *         name: individualId
 *         required: true
 *         description: MongoDB `_id` of the student/individual
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visibility settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Visibility record fields from the database
 *       400:
 *         description: Missing or invalid individualId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Individual ID is required
 *       404:
 *         description: No visibility settings found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Visibility settings not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { individualId } = await params;

    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const visibility = await IndividualVisibility.findOne({
      IIV_Individual_Id: individualId,
    });

    if (!visibility) {
      return NextResponse.json(
        { success: false, message: "Visibility settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: visibility },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching visibility settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}