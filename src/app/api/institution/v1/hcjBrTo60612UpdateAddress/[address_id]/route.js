import IndividualAddress from "@/app/models/individual_address_detail";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60612UpdateAddress/{address_id}:
 *   patch:
 *     summary: Update Address Details
 *     description: Updates specific fields of an individual's address.
 *     tags: [Administrator Individual Address]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the address details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IAD_Address_Line1:
 *                 type: string
 *               IAD_City:
 *                 type: string
 *               IAD_State:
 *                 type: string
 *               IAD_Pincode:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Address details updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Address details not found
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
          code: "6061_48",
          message: t("errorCode.6061_48.title"),
          description: t("errorCode.6061_48.description"),
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_31",
          message: t("errorCode.6061_31.title"),
          description: t("errorCode.6061_31.description"),
        },
        { status: 401 }
      );
    }

    const updateData = await req.json();
    const updatedAddress = await IndividualAddress.findByIdAndUpdate(
      address_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedAddress) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_49",
          message: t("errorCode.6061_49.title"),
          description: t("errorCode.6061_49.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6061_50",
        message: t("errorCode.6061_50.title"),
        description: t("errorCode.6061_50.description"),
        data: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address details:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_46",
        message: t("errorCode.6061_46.title"),
        description: t("errorCode.6061_46.description", {
          message: error.message,
        }),
      },
      { status: 500 }
    );
  }
}
