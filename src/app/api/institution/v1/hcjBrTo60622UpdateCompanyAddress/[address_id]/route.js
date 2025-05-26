import CompanyAddress from "@/app/models/company_address_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60622UpdateCompanyAddress/{address_id}:
 *   patch:
 *     summary: Update Company Address
 *     description: Updates specific fields of the company's address.
 *     tags: [Company Address]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the company address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CAD_Address_Line1:
 *                 type: string
 *               CAD_Address_Line2:
 *                 type: string
 *               CAD_City:
 *                 type: string
 *               CAD_State:
 *                 type: string
 *               CAD_Pincode:
 *                 type: string
 *               CAD_Country:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company address updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Company address not found
 *       500:
 *         description: Internal Server Error
 */

export async function PATCH(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();

    const { address_id } = await params;
    if (!address_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_24",
          title: t("errorCode.6062_24.title"),
          message: t("errorCode.6062_24.description"),
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
    const updatedAddress = await CompanyAddress.findByIdAndUpdate(
      address_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedAddress) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_26",
          title: t("errorCode.6062_26.title"),
          message: t("errorCode.6062_26.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6062_27",
        title: t("errorCode.6062_27.title"),
        message: t("errorCode.6062_27.description"),
        data: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company address:", error);
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
