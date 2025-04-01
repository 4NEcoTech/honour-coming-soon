import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualAddress from "@/app/models/individual_address_detail";
import SocialLinks from "@/app/models/social_link";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/hcj/v1/adminPublicProfile/{userId}:
 *   get:
 *     summary: Get Admin Public Profile
 *     description: Fetches public details of an admin user including individual details, address, and social links.
 *     tags: [Admin Public Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the admin user
 *     responses:
 *       200:
 *         description: Admin public profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     individualDetails:
 *                       type: object
 *                     address:
 *                       type: object
 *                     socialLinks:
 *                       type: object
 *       400:
 *         description: User ID is required
 *       404:
 *         description: Admin details not found
 *       500:
 *         description: Internal Server Error
 */

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const userId = await params?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // Fetch User Profile Data
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Fetch Individual Details
    const individualDetails = await IndividualDetails.findOne({ ID_User_Id: user._id }).lean();

    if (!individualDetails) {
      return NextResponse.json({ success: false, message: "Individual details not found" }, { status: 404 });
    }

    // Fetch Related Data Concurrently
    const [address, socialLinks] = await Promise.all([
      IndividualAddress.findOne({ IAD_Individual_Id: individualDetails._id }).lean(),
      SocialLinks.findOne({ SL_Id: individualDetails._id }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Public profile retrieved successfully",
      data: {
        user,
        individualDetails,
        address: address || null,
        socialLinks: socialLinks || null,
      },
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}