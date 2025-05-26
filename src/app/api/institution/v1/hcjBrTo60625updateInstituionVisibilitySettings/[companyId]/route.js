import { NextResponse } from "next/server";
import CompanyVisibility from "@/app/models/company_info_visibility";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60625updateInstituionVisibilitySettings/{companyId}:
 *   patch:
 *     summary: Update company/institution visibility preferences
 *     description: >
 *       Updates the public visibility settings for a company or institution profile.  
 *       Accepts frontend-friendly keys like `showPhone` and maps them to internal database fields.  
 *       Supports partial updates and will upsert the visibility document if not present.
 *     tags:
 *       - Institution
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: MongoDB `_id` of the company/institution
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
 *               showWebsite:
 *                 type: boolean
 *               showAddressLine1:
 *                 type: boolean
 *               showAddressLine2:
 *                 type: boolean
 *               showLandmark:
 *                 type: boolean
 *               showPincode:
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
 *         description: Missing company ID or invalid request body
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
 *         description: Internal server error during update
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
    const { companyId } = await params;

    if (!companyId || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Missing companyId or invalid body" },
        { status: 400 }
      );
    }

    const fieldMap = {
      showPhone: "CIV_Phone_Number",
      showEmail: "CIV_Email",
      showWebsite: "CIV_Website_URL",
      showAddressLine1: "CIV_Address_Line1",
      showAddressLine2: "CIV_Address_Line2",
      showLandmark: "CIV_Landmark",
      showPincode: "CIV_Pincode",
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

    await CompanyVisibility.updateOne(
      { CIV_Company_Id: companyId },
      { $set: updates },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Visibility updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH institution visibility error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
