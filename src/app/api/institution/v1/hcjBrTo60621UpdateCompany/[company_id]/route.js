import CompanyDetails from "@/app/models/company_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60621UpdateCompany/{company_id}:
 *   patch:
 *     summary: Update Company Details
 *     description: Updates specific fields of the company's details.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CD_Company_Name:
 *                 type: string
 *               CD_Company_Email:
 *                 type: string
 *               CD_Phone_Number:
 *                 type: string
 *               CD_Company_Website:
 *                 type: string
 *               CD_Company_About:
 *                 type: string
 *               CD_Company_Type:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company details updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Company details not found
 *       500:
 *         description: Internal Server Error
 */

export async function PATCH(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();

    const { company_id } = await params;
    if (!company_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_18",
          title: t("errorCode.6062_18.title"),
          message: t("errorCode.6062_18.description"),
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_19",
          title: t("errorCode.6062_19.title"),
          message: t("errorCode.6062_19.description"),
        },
        { status: 401 }
      );
    }

    const updateData = await req.json();
    const updatedCompany = await CompanyDetails.findByIdAndUpdate(
      company_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedCompany) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_21",
          title: t("errorCode.6062_21.title"),
          message: t("errorCode.6062_21.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6062_23",
        title: t("errorCode.6062_23.title"),
        message: t("errorCode.6062_23.description"),
        data: updatedCompany,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company details:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6062_17",
        title: t("errorCode.6062_17.title"),
        message: t("errorCode.6062_17.description", {
          message: error.message,
        }),
      },
      { status: 500 }
    );
  }
}
