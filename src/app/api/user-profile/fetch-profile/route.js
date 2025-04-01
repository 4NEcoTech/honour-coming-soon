import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import User from "@/app/models/user_table";
import UserProfileCompletion from "@/app/models/user_profile_completion";

/**
 * @swagger
 * /api/user-profile/fetch-profile:
 *   get:
 *     summary: Fetch user profile completion status
 *     description: Retrieves the profile completion status of a logged-in user.
 *     tags:
 *       - User Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile completion status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 role:
 *                   type: string
 *                   example: "Institution Admin"
 *                 profileCompletion:
 *                   type: object
 *                   properties:
 *                     UPC_Profile_Completed:
 *                       type: boolean
 *                       example: true
 *                     UPC_StudentProfile:
 *                       type: boolean
 *                       example: false
 *                     UPC_InstitutionAdminProfile:
 *                       type: boolean
 *                       example: true
 *                     UPC_EducationDetails:
 *                       type: boolean
 *                       example: false
 *                     UPC_EmployerProfile:
 *                       type: boolean
 *                       example: false
 *                     UPC_JobSeekerProfile:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized - No active session.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */

export async function GET(req) {
  try {
    await dbConnect();

    // Authenticate session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        { error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Fetch user basic details
    const user = await User.findOne(
      { UT_Email: userEmail },
      { UT_Email: 1, UT_User_Role: 1 }
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch profile completion details from `user_profile_completion`
    const profileCompletion = await UserProfileCompletion.findOne(
      { UPC_User_Id: user._id },
      { UPC_Profile_Completed: 1, UPC_StudentProfile: 1, UPC_InstitutionAdminProfile: 1, UPC_EducationDetails: 1, UPC_EmployerProfile: 1, UPC_JobSeekerProfile: 1 }
    );

    return Response.json({
      email: user.UT_Email,
      role: user.UT_User_Role,
      profileCompletion: profileCompletion || {},
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
