import { dbConnect } from "@/app/utils/dbConnect";
import Project from "@/app/models/hcj_job_seeker_project";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60881AddProject
 *   post:
 *     summary: Create a new project
 *     description: Adds a new job seeker project to the database.
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSP_Job_Seeker_Id:
 *                 type: string
 *                 format: uuid
 *               HCJ_JSP_Individual_Id:
 *                 type: string
 *                 format: uuid
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
 *               HCJ_JSP_Session_Id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Internal server error.
 *
 *   get:
 *     summary: Get all projects
 *     description: Retrieves a list of all job seeker projects.
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects.
 *       500:
 *         description: Internal server error.
 */

//  POST: Create a New Project
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.json();
    const auditTrail = await generateAuditTrail(req);

    //  Create new project
    const newProject = new Project({
      HCJ_JSP_Job_Seeker_Id: formData.HCJ_JSP_Job_Seeker_Id,
      HCJ_JSP_Individual_Id: formData.HCJ_JSP_Individual_Id,
      HCJ_JSP_Project_Name: formData.HCJ_JSP_Project_Name,
      HCJ_JSP_Company_Name: formData.HCJ_JSP_Company_Name,
      HCJ_JSP_Start_Date: new Date(formData.HCJ_JSP_Start_Date),
      HCJ_JSP_End_Date: formData.HCJ_JSP_End_Date ? new Date(formData.HCJ_JSP_End_Date) : null,
      HCJ_JSP_Project_Status: formData.HCJ_JSP_Project_Status,
      HCJ_JSP_Project_Description: formData.HCJ_JSP_Project_Description,
      HCJ_JSP_Audit_Trail: [auditTrail],
    });

    await newProject.save();

    return NextResponse.json(
      { message: "Project created successfully!", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during project creation:", error);
    return NextResponse.json(
      { message: "Error creating the project.", error },
      { status: 500 }
    );
  }
}

//  GET: Fetch All Projects

export async function GET(req) {
  try {
    await dbConnect();

    // Extract Individual ID from query parameters
    const { searchParams } = new URL(req.url);
    const individualId = searchParams.get("HCJ_JSX_Individual_Id");

    let projects;

    if (individualId) {
      // Fetch projects for the specified Individual ID
      projects = await Project.find({ HCJ_JSX_Individual_Id: individualId });

      if (!projects || projects.length === 0) {
        return NextResponse.json(
          { success: false, message: "No projects found for this Individual ID" },
          { status: 404 }
        );
      }
    } else {
      // Fetch all projects if no Individual ID is provided
      projects = await Project.find();
    }

    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project(s):", error);
    return NextResponse.json(
      { success: false, message: "Error fetching project(s)", error },
      { status: 500 }
    );
  }
}




