import SocialLinks from "@/app/models/social_link";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60613UpdateSocialLinks/{social_id}:
 *   patch:
 *     summary: Update Social Links
 *     description: Updates specific fields of an individual's social profile.
 *     tags: [Administrator Social Links]
 *     parameters:
 *       - in: path
 *         name: social_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the social links
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
 *               SL_Website_Url:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Social links updated successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Social links not found
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
          code: "6061_51",
          title: t("errorCodes.6061_51.title"),
          message: t("errorCodes.6061_51.message"),
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6061_36",
          title: t("errorCodes.6061_36.title"),
          message: t("errorCodes.6061_36.message"),
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
          code: "6061_52",
          title: t("errorCodes.6061_52.title"),
          message: t("errorCodes.6061_52.message"),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,

        code: "6061_53",
        title: t("errorCodes.6061_53.title"),
        message: t("errorCodes.6061_53.message"),
        data: updatedSocialLinks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating social links:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6061_46",
        title: t("errorCodes.6061_46.title"),
        message: t("errorCodes.6061_46.message", {
          message: error.message,
        }),
      },
      { status: 500 }
    );
  }
}
