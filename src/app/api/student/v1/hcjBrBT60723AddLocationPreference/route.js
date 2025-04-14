import { dbConnect } from "@/app/utils/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60723AddLocationPreference:
 *   patch:
 *     summary: Update Student Preferred Work Location
 *     description: Updates the preferred work location of the currently logged-in job seeker or a specific individual ID if provided.
 *     tags: [Student Add Location Preference]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               individualId:
 *                 type: string
 *                 required: false
 *                 description: Individual ID of the job seeker (defaults to session user if not provided)
 *               preferredWorkLocation:
 *                 type: string
 *                 required: true
 *                 example: Remote, Bengaluru
 *     responses:
 *       200:
 *         description: Preferred work location updated successfully
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
 *                   example: Preferred work location updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferredWorkLocation:
 *                       type: string
 *                       example: Bengaluru
 *       400:
 *         description: Missing individual ID or location
 *       404:
 *         description: Job seeker not found
 *       500:
 *         description: Internal Server Error
 */


export async function PATCH(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const body = await req.json();

    const individualId = body?.individualId || session?.user?.id;
    const preferredLocation = body?.preferredWorkLocation;

    // Validation
    if (!individualId) {
      return new Response(
        JSON.stringify({ success: false, message: "Individual ID is required" }),
        { status: 400 }
      );
    }

    if (!preferredLocation || preferredLocation.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "Preferred work location is required" }),
        { status: 400 }
      );
    }

    // Find and update
    const jobSeeker = await Hcj_Job_Seeker.findOneAndUpdate(
      { HCJ_JS_Individual_Id: individualId },
      { HCJ_JS_Preferred_Work_Location: preferredLocation.trim() },
      { new: true }
    );

    if (!jobSeeker) {
      return new Response(
        JSON.stringify({ success: false, message: "Job Seeker not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Preferred work location updated successfully",
        data: {
          preferredWorkLocation: jobSeeker.HCJ_JS_Preferred_Work_Location,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Update preferred location error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
