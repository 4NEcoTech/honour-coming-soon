import IndividualAddress from "@/app/models/individual_address_detail";
import IndividualDetails from "@/app/models/individual_details";
import IndividualDocuments from "@/app/models/individual_document_details";
import SocialLinks from "@/app/models/social_link";
import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjArET60521FetchAdminData/[administrator_id]:
 *   get:
 *     summary: Get Administrator Details
 *     description: Fetches administrator details along with individual details, address, social links, and documents.
 *     tags: [Administrator]
 *     parameters:
 *       - in: path
 *         name: administrator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the administrator
 *     security:
 *       - BearerAuth: []  # JWT or session authentication
 *     responses:
 *       200:
 *         description: Administrator details retrieved successfully
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
 *                   example: "Administrator details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User details
 *                     individualDetails:
 *                       type: object
 *                       description: Individual details
 *                     address:
 *                       type: object
 *                       nullable: true
 *                       description: Address details (null if not available)
 *                     socialLinks:
 *                       type: object
 *                       nullable: true
 *                       description: Social links (null if not available)
 *                     documents:
 *                       type: object
 *                       nullable: true
 *                       description: Uploaded documents (null if not available)
 *       400:
 *         description: Missing administrator ID
 *       401:
 *         description: Unauthorized - User session invalid
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Administrator or details not found
 *       500:
 *         description: Internal Server Error
 */

export async function GET(req, { params }) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();

    const { administrator_id } = await params;
    if (!administrator_id) {
      return NextResponse.json(
        {
          success: false,
          code: "6052_1",
          title: t("errorCode.6052_1.title"),
          message: t("errorCode.6052_1.description"),
        },
        { status: 400 }
      );
    }

    // Validate session
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          code: "6052_2",
          title: t("errorCode.6052_2.title"),
          message: t("errorCode.6052_2.description"),
        },
        { status: 401 }
      );
    }

    // Fetch User by administrator_id
    const user = await User.findById(administrator_id).lean();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: "6052_3",
          title: t("errorCode.6052_3.title"),
          message: t("errorCode.6052_3.description"),
        },
        { status: 404 }
      );
    }

    // Ensure that the requested data belongs to the logged-in user
    if (session.user.email !== user.UT_User_Id) {
      return NextResponse.json(
        {
          success: false,
          code: "6052_4",
          title: t("errorCode.6052_4.title"),
          message: t("errorCode.6052_4.description"),
        },
        { status: 403 }
      );
    }

    // Fetch Individual Details
    const individualDetails = await IndividualDetails.findOne({
      ID_User_Id: user._id,
    }).lean();

    if (!individualDetails) {
      return NextResponse.json(
        {
          success: false,
          code: "6052_5",
          title: t("errorCode.6052_5.title"),
          message: t("errorCode.6052_5.description"),
        },
        { status: 404 }
      );
    }

    // Fetch Related Data Concurrently
    const [address, socialLinks, documents] = await Promise.all([
      IndividualAddress.findOne({
        IAD_Individual_Id: individualDetails._id,
      }).lean(),
      SocialLinks.findOne({ SL_Id: individualDetails._id }).lean(),
      IndividualDocuments.findOne({
        IDD_Individual_Id: individualDetails._id,
      }).lean(),
    ]);

    return NextResponse.json(
      {
        success: true,
        code: "6052_6",
        title: t("errorCode.6052_6.title"),
        message: t("errorCode.6052_6.description"),
        data: {
          user,
          individualDetails,
          address: address || null,
          socialLinks: socialLinks || null,
          documents: documents || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching administrator details:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6052_7",
        title: t("errorCode.6052_7.title"),
        message: t("errorCode.6052_7.description", { message: error.message }),
      },
      { status: 500 }
    );
  }
}
