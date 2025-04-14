import { dbConnect } from "@/app/utils/dbConnect";
import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60724FetchLocationPreference/{individualId}:
 *   get:
 *     summary: Get Preferred Work Location
 *     description: Fetches the preferred work location for a job seeker using their individual ID.
 *     tags: [Student Fetch Location Preference]
 *     parameters:
 *       - in: path
 *         name: individualId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the individual's profile
 *     responses:
 *       200:
 *         description: Preferred work location fetched successfully
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
 *                   example: Preferred work location fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferredWorkLocation:
 *                       type: string
 *                       nullable: true
 *                       example: "Remote, Bengaluru"
 *       400:
 *         description: Individual ID is required
 *       404:
 *         description: Job Seeker not found
 *       500:
 *         description: Internal Server Error
 */


export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { individualId } = await params;

    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const jobSeeker = await Hcj_Job_Seeker.findOne({
      HCJ_JS_Individual_Id: individualId,
    }).lean();

    if (!jobSeeker) {
      return NextResponse.json(
        { success: false, message: "Job Seeker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Preferred work location fetched successfully",
      data: {
        preferredWorkLocation: jobSeeker.HCJ_JS_Preferred_Work_Location || null,
      },
    });
  } catch (error) {
    console.error("Fetch preferred location error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
