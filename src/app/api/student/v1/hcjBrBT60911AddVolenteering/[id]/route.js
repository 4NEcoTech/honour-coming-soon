import { dbConnect } from "@/app/utils/dbConnect";
import HcjJobSeekerVolunteerActivity from "@/app/models/hcj_job_seeker_volunteer_activity"; // ✅ Correct Import
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60911AddVolenteering/[id]
 *   get:
 *     summary: Get a single volunteering activity
 *     description: Retrieves a single volunteering activity by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Volunteer activity retrieved successfully.
 *       404:
 *         description: Volunteer activity not found.
 *       500:
 *         description: Error fetching volunteer activity.
 *
 *   patch:
 *     summary: Update a volunteering activity
 *     description: Updates an existing volunteering activity by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Volunteer activity updated successfully.
 *       404:
 *         description: Volunteer activity not found.
 *       500:
 *         description: Error updating volunteer activity.
 *
 *   delete:
 *     summary: Delete a volunteering activity
 *     description: Deletes a volunteering activity by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Volunteer activity deleted successfully.
 *       404:
 *         description: Volunteer activity not found.
 *       500:
 *         description: Error deleting volunteer activity.
 */

//  GET: Fetch Single Volunteer Activity by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    //  Check if the ID is valid
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const activity = await HcjJobSeekerVolunteerActivity.findById(id);

    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Volunteer activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, activity }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteer activity:", error);
    return NextResponse.json(
      { message: "Error fetching volunteer activity.", error },
      { status: 500 }
    );
  }
}

//  PATCH: Update a Volunteer Activity
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const formData = await req.json();

    //  Validate that required fields exist
    if (
      !id ||
      !formData.HCJ_JSV_VolunteerActivity_Name ||
      !formData.HCJ_JSV_Company_Name
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const auditTrail = await generateAuditTrail(req);

    const updatedActivity =
      await HcjJobSeekerVolunteerActivity.findByIdAndUpdate(
        id,
        {
          $set: {
            HCJ_JSV_VolunteerActivity_Name:
              formData.HCJ_JSV_VolunteerActivity_Name,
            HCJ_JSV_Company_Name: formData.HCJ_JSV_Company_Name,
            HCJ_JSV_Start_Date: formData.HCJ_JSV_Start_Date
              ? new Date(formData.HCJ_JSV_Start_Date)
              : null,
            HCJ_JSV_End_Date: formData.HCJ_JSV_End_Date
              ? new Date(formData.HCJ_JSV_End_Date)
              : null,
            HCJ_JSV_VolunteerActivity_Status:
              formData.HCJ_JSV_VolunteerActivity_Status,
            HCJ_JSV_VolunteerActivity_Description:
              formData.HCJ_JSV_VolunteerActivity_Description,
          },
          $push: { HCJ_JSV_Audit_Trail: auditTrail },
        },
        { new: true }
      );

    if (!updatedActivity) {
      return NextResponse.json(
        { success: false, message: "Volunteer activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, updatedActivity },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating volunteer activity:", error);
    return NextResponse.json(
      { message: "Error updating volunteer activity.", error },
      { status: 500 }
    );
  }
}

//  DELETE: Remove a Volunteer Activity
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const deletedActivity =
      await HcjJobSeekerVolunteerActivity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return NextResponse.json(
        { success: false, message: "Volunteer activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Volunteer activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting volunteer activity:", error);
    return NextResponse.json(
      { message: "Error deleting volunteer activity.", error },
      { status: 500 }
    );
  }
}
