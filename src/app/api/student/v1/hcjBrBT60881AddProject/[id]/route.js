import { dbConnect } from "@/app/utils/dbConnect";
import Project from "@/app/models/hcj_job_seeker_project";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60881AddProject/[id]
 *   get:
 *     summary: Get a single project
 *     description: Retrieves details of a single project by its ID.
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update a project
 *     description: Updates an existing project by its ID.
 *     tags: [Projects]
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
 *             properties:
 *               HCJ_JSP_Project_Name:
 *                 type: string
 *               HCJ_JSP_Company_Name:
 *                 type: string
 *               HCJ_JSP_Start_Date:
 *                 type: string
 *                 format: date
 *               HCJ_JSP_End_Date:
 *                 type: string
 *                 format: date
 *               HCJ_JSP_Project_Status:
 *                 type: string
 *                 enum: ["Ongoing", "Completed", "Paused"]
 *               HCJ_JSP_Project_Description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete a project
 *     description: Deletes a project by its ID.
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Internal server error.
 */

//  GET: Fetch a Single Project
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Error fetching project.", error },
      { status: 500 }
    );
  }
}

//  PATCH: Update an Existing Project
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const formData = await req.json();
    const auditTrail = await generateAuditTrail(req);

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        $set: {
          HCJ_JSP_Project_Name: formData.HCJ_JSP_Project_Name,
          HCJ_JSP_Company_Name: formData.HCJ_JSP_Company_Name,
          HCJ_JSP_Start_Date: new Date(formData.HCJ_JSP_Start_Date),
          HCJ_JSP_End_Date: formData.HCJ_JSP_End_Date ? new Date(formData.HCJ_JSP_End_Date) : null,
          HCJ_JSP_Project_Status: formData.HCJ_JSP_Project_Status,
          HCJ_JSP_Project_Description: formData.HCJ_JSP_Project_Description,
        },
        $push: { HCJ_JSP_Audit_Trail: auditTrail },
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedProject }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Error updating project.", error },
      { status: 500 }
    );
  }
}

//  DELETE: Remove a Project
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    //  Check if project exists
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Error deleting project.", error },
      { status: 500 }
    );
  }
}



