import { NextResponse } from "next/server";
import IndividualVisibility from "@/app/models/individual_info_visibility";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60617updateAdminVisibilitySettings/{individualId}:
 *   patch:
 *     summary: Update student visibility preferences
 *     description: >
 *       Updates public profile visibility flags for a student.  
 *       Accepts key-value pairs like `showPhone: true`, which are mapped to internal DB fields.  
 *       Creates the record if it doesn't exist (upsert).
 *     tags:
 *       - Update Admin Profile VIsibility Setting
 *     parameters:
 *       - in: path
 *         name: individualId
 *         required: true
 *         description: MongoDB `_id` of the individual whose visibility is being updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showPhone:
 *                 type: boolean
 *               showEmail:
 *                 type: boolean
 *               showBirthDate:
 *                 type: boolean
 *               showAddressLine1:
 *                 type: boolean
 *               showAddressLine2:
 *                 type: boolean
 *               showLandmark:
 *                 type: boolean
 *               showPincode:
 *                 type: boolean
 *               showWebsite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Visibility settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Visibility updated successfully
 *       400:
 *         description: Missing ID or no valid fields provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
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

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json(); 
    const { individualId } = params;

    if (!individualId || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Missing individualId or invalid body" },
        { status: 400 }
      );
    }

    // Frontend to DB field map
    const fieldMap = {
      showPhone: "IIV_Phone_Number",
      showEmail: "IIV_Email",
      showBirthDate: "IIV_BirthDate",
      showAddressLine1: "IIV_Address_Line1",
      showAddressLine2: "IIV_Address_Line2",
      showLandmark: "IIV_Landmark",
      showPincode: "IIV_Pincode",
      showWebsite: "IIV_Website_Url_Visibility",
    };

    const updates = {};

    for (const key in body) {
      if (fieldMap[key]) {
        updates[fieldMap[key]] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    await IndividualVisibility.updateOne(
      { IIV_Individual_Id: individualId },
      { $set: updates },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Visibility updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH visibility error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
