import UserProfileCompletion from '@/app/models/user_profile_completion';
import { dbConnect } from "@/app/utils/dbConnect";


/**
 * @swagger
 * /api/user-profile/update-profile:
 *   post:
 *     summary: Update user profile completion step
 *     description: Updates the profile completion step for a user. If no record exists, it will create one.
 *     tags:
 *       - User Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60b6c0f10c9d440000c9aabc"
 *               completedStep:
 *                 type: string
 *                 enum: ["StudentProfile", "InstitutionAdminProfile", "EducationDetails", "EmployerProfile", "JobSeekerProfile"]
 *                 example: "StudentProfile"
 *     responses:
 *       200:
 *         description: Profile step updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile step updated successfully"
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal Server Error.
 */


export async function POST(req) {
  try {
    const { userId, completedStep } = await req.json();
    await dbConnect();

    // Ensure the profile completion record exists, then update
    await UserProfileCompletion.updateOne(
      { UPC_User_Id: userId },
      { $set: { [`UPC_${completedStep}`]: true } },
      { upsert: true }
    );

    return Response.json({ message: "Profile step updated successfully" });
  } catch (error) {
    console.error("Error updating profile step:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
