import SocialLinks from "@/app/models/social_link";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60623UpdateCompanySocialLinks/{social_id}:
 *   patch:
 *     summary: Update Company Social Links
 *     description: Updates specific fields of the company's social links.
 *     tags: [Company Social Links]
 *     parameters:
 *       - in: path
 *         name: social_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the company's social links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SL_LinkedIn_Profile:
 *                 type: string
 *               SL_Instagram_Url:
 *                 type: string
 *               SL_Facebook_Url:
 *                 type: string
 *               SL_Website_Url:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company social links updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Company social links not found
 *       500:
 *         description: Internal Server Error
 */

export async function PATCH(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();

    const { social_id } = await params;
    if (!social_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_28",
          title: t("errorCode.6062_28.title"),
          message: t("errorCode.6062_28.description"),
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
    const updatedSocialLinks = await SocialLinks.findByIdAndUpdate(
      social_id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedSocialLinks) {
      return NextResponse.json(
        {
          success: false,
          code: "6062_29",
          title: t("errorCode.6062_29.title"),
          message: t("errorCode.6062_29.description"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "6062_30",
        title: t("errorCode.6062_30.title"),
        message: t("errorCode.6062_30.description"),
        data: updatedSocialLinks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company social links:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6062_17",
        title: t("errorCode.6062_17.title"),
        message: t("errorCode.6062_17.description"),
      },
      { status: 500 }
    );
  }
}
