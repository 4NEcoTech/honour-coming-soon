import { dbConnect } from "@/app/utils/dbConnect";
import VolunteerActivity from "@/app/models/hcj_job_seeker_volunteer_activity";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60911AddVolunteering:
 *   post:
 *     summary: Create a new volunteering activity
 *     description: Adds a new volunteering activity record for a job seeker.
 *     tags: [Volunteering]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSV_Job_Seeker_Id:
 *                 type: string
 *                 format: uuid
 *               HCJ_JSV_Individual_Id:
 *                 type: string
 *                 format: uuid
 *               HCJ_JSV_VolunteerActivity_Name:
 *                 type: string
 *               HCJ_JSV_Company_Name:
 *                 type: string
 *               HCJ_JSV_Start_Date:
 *                 type: string
 *                 format: date
 *               HCJ_JSV_End_Date:
 *                 type: string
 *                 format: date
 *               HCJ_JSV_VolunteerActivity_Status:
 *                 type: string
 *                 enum: ["Ongoing", "Completed"]
 *               HCJ_JSV_VolunteerActivity_Description:
 *                 type: string
 *               HCJ_JSV_Session_Id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Volunteer activity added successfully.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Internal server error.
 *
 *   get:
 *     summary: Get all volunteering activities
 *     description: Retrieves a list of all volunteering activities.
 *     tags: [Volunteering]
 *     responses:
 *       200:
 *         description: A list of volunteering activities.
 *       500:
 *         description: Internal server error.
 */

// Post

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.json();
    const auditTrail = await generateAuditTrail(req);

    const volunteerActivity = new VolunteerActivity({
      HCJ_JSV_Job_Seeker_Id: formData.HCJ_JSV_Job_Seeker_Id,
      HCJ_JSV_Individual_Id: formData.HCJ_JSV_Individual_Id,
      HCJ_JSV_VolunteerActivity_Name: formData.HCJ_JSV_VolunteerActivity_Name,
      HCJ_JSV_Company_Name: formData.HCJ_JSV_Company_Name,
      HCJ_JSV_Start_Date: new Date(formData.HCJ_JSV_Start_Date),
      HCJ_JSV_End_Date: formData.HCJ_JSV_End_Date
        ? new Date(formData.HCJ_JSV_End_Date)
        : null,
      HCJ_JSV_VolunteerActivity_Status:
        formData.HCJ_JSV_VolunteerActivity_Status,
      HCJ_JSV_VolunteerActivity_Description:
        formData.HCJ_JSV_VolunteerActivity_Description,
      HCJ_JSV_Session_Id: formData.HCJ_JSV_Session_Id,
      HCJ_JSV_Audit_Trail: [auditTrail],
    });

    await volunteerActivity.save();

    return NextResponse.json(
      { message: "Volunteer activity added successfully!", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during volunteer activity creation:", error);
    return NextResponse.json(
      { message: "Error creating the volunteer activity.", error },
      { status: 500 }
    );
  }
}


// get all
export async function GET(req) {
  try {
    await dbConnect();

    // Extract Individual ID from query parameters
    const { searchParams } = new URL(req.url);
    const individualId = searchParams.get("HCJ_JSV_Individual_Id");

    // Validate that Individual ID is provided
    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    // Fetch only volunteer activities for the specified Individual ID
    const activities = await VolunteerActivity.find({ HCJ_JSV_Individual_Id: individualId });

    // If no records found
    if (!activities || activities.length === 0) {
      return NextResponse.json(
        { success: false, message: "No volunteer activities found for this Individual ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, activities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteer activities:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching volunteer activities", error },
      { status: 500 }
    );
  }
}



