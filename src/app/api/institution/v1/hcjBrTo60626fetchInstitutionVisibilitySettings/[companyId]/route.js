import { NextResponse } from "next/server";
import CompanyVisibility from "@/app/models/company_info_visibility";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60626fetchInstitutionVisibilitySettings/{companyId}:
 *   get:
 *     summary: Get company/institution visibility preferences
 *     description: >
 *       Retrieves the public visibility settings for a company or institution  
 *       based on the `companyId` (`CIV_Company_Id` in the database).
 *     tags:
 *       - Institution
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: MongoDB `_id` of the company/institution
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
 *                   description: Visibility document fields (e.g. CIV_Email, CIV_Phone_Number)
 *       400:
 *         description: Missing company ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Company ID is required
 *       404:
 *         description: Visibility settings not found
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
    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: "Company ID is required" },
        { status: 400 }
      );
    }

    const visibility = await CompanyVisibility.findOne({
      CIV_Company_Id: companyId,
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
    console.error("Error fetching institution visibility settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
