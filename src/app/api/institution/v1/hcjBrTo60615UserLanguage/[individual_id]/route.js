import { getServerSession } from "next-auth";
import JobSeekerLanguages from "@/app/models/hcj_job_seeker_languages";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjBrTo60615UserLanguage/{individual_id}:
 *   post:
 *     summary: Add User Language
 *     description: Adds a new language for a job seeker.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: individual_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the job seeker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSL_Source:
 *                 type: string
 *                 description: Source of language data (e.g., user input)
 *               HCJ_JSL_Id:
 *                 type: string
 *                 description: Unique language entry ID
 *               HCJ_JSL_Language:
 *                 type: string
 *                 description: Name of the language
 *               HCJ_JSL_Language_Proficiency_Level:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: Proficiency level (1: Beginner - 5: Expert)
 *               HCJ_JSL_Language_Proficiency:
 *                 type: string
 *                 enum: ["Basic", "Intermediate", "Advanced"]
 *                 description: Text-based proficiency category
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: User language added successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal Server Error
 *   get:
 *     summary: Get All Languages of an Individual
 *     description: Fetches all language records associated with a specific job seeker.
 *     tags: [Job Seeker Languages]
 *     parameters:
 *       - in: path
 *         name: individual_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the job seeker
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user languages retrieved successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No languages found for the user
 *       500:
 *         description: Internal Server Error
 */

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { individual_id } = await params;

    if (!individual_id) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const {
      HCJ_JSL_Source,
      HCJ_JSL_Id,
      HCJ_JSL_Language,
      HCJ_JSL_Language_Proficiency_Level,
      HCJ_JSL_Language_Proficiency
    } = await req.json();

    if (!HCJ_JSL_Source || !HCJ_JSL_Id || !HCJ_JSL_Language || !HCJ_JSL_Language_Proficiency_Level || !HCJ_JSL_Language_Proficiency) {
      return NextResponse.json(
        { success: false, message: "All language fields are required" },
        { status: 400 }
      );
    }

    const newLanguage = new JobSeekerLanguages({
      HCJ_JSL_Source,
      HCJ_JSL_Id,
      HCJ_JSL_Language,
      HCJ_JSL_Language_Proficiency_Level,
      HCJ_JSL_Language_Proficiency
    });

    await newLanguage.save();

    return NextResponse.json(
      { success: true, message: "User language added successfully", data: newLanguage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user language:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { individual_id } = await params;

    if (!individual_id) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userLanguages = await JobSeekerLanguages.find({
      HCJ_JSL_Id: individual_id,
    }).lean();

    if (!userLanguages || userLanguages.length === 0) {
      return NextResponse.json(
        { success: false, message: "No languages found for the user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User languages retrieved successfully", data: userLanguages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user languages:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
