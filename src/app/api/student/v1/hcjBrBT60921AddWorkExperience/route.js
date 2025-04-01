import { dbConnect } from "@/app/utils/dbConnect";
import {
  Experience,
  experienceSchemaZod,
} from "@/app/models/hcj_job_seeker_experience";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60921AddWorkExperience
 *   post:
 *     summary: Create a new work experience
 *     description: Adds a new job seeker work experience record.
 *     tags: [Experience]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSX_Job_Seeker_Id:
 *                 type: string
 *                 format: uuid
 *               HCJ_JSX_Individual_Id:
 *                 type: string
 *                 format: uuid
 *               HCJ_JSX_Company_Name:
 *                 type: string
 *               HCJ_JSX_Start_Date:
 *                 type: string
 *                 format: date
 *               HCJ_JSX_End_Date:
 *                 type: string
 *                 format: date
 *               HCJ_JSX_Currently_Working:
 *                 type: boolean
 *               HCJ_JSX_Job_Description:
 *                 type: string
 *               HCJ_JSX_Job_Title:
 *                 type: string
 *               HCJ_JSX_Country:
 *                 type: string
 *               HCJ_JSX_State:
 *                 type: string
 *               HCJ_JSX_City:
 *                 type: string
 *               HCJ_JSX_Work_Mode:
 *                 type: string
 *               HCJ_JSX_Employement_Type:
 *                 type: string
 *               HCJ_JSX_Project_Name:
 *                 type: string
 *               HCJ_JSX_Volunteering_Activity:
 *                 type: string
 *               HCJ_JSX_About_Project:
 *                 type: string
 *               HCJ_JSX_Updated_By:
 *                 type: string
 *               HCJ_JSX_Session_Id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Experience added successfully.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Error processing the request.
 *
 *   get:
 *     summary: Get all work experiences
 *     description: Retrieves a list of all job seeker experiences.
 *     tags: [Experience]
 *     responses:
 *       200:
 *         description: A list of experiences.
 *       500:
 *         description: Error fetching experiences.
 */



export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.json();
    const validatedData = experienceSchemaZod.safeParse(formData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const auditTrail = await generateAuditTrail(req);

    //  Creating Experience Record
    const experience = new Experience({
      HCJ_JSX_Job_Seeker_Id: validatedData.data.HCJ_JSX_Job_Seeker_Id,
      HCJ_JSX_Individual_Id: validatedData.data.HCJ_JSX_Individual_Id,
      HCJ_JSX_Company_Name: validatedData.data.HCJ_JSX_Company_Name,
      HCJ_JSX_Start_Date: new Date(validatedData.data.HCJ_JSX_Start_Date),
      HCJ_JSX_End_Date: validatedData.data.HCJ_JSX_Currently_Working
        ? null
        : new Date(validatedData.data.HCJ_JSX_End_Date),
      HCJ_JSX_Currently_Working: validatedData.data.HCJ_JSX_Currently_Working,
      HCJ_JSX_Job_Description: validatedData.data.HCJ_JSX_Job_Description,
      HCJ_JSX_Job_Title: validatedData.data.HCJ_JSX_Job_Title,
      HCJ_JSX_Country: validatedData.data.HCJ_JSX_Country,
      HCJ_JSX_State: validatedData.data.HCJ_JSX_State,
      HCJ_JSX_City: validatedData.data.HCJ_JSX_City,
      HCJ_JSX_Work_Mode: validatedData.data.HCJ_JSX_Work_Mode,
      HCJ_JSX_Employement_Type: validatedData.data.HCJ_JSX_Employement_Type,
      HCJ_JSX_Project_Name: validatedData.data.HCJ_JSX_Project_Name,
      HCJ_JSX_Volunteering_Activity:
        validatedData.data.HCJ_JSX_Volunteering_Activity,
      HCJ_JSX_About_Project: validatedData.data.HCJ_JSX_About_Project,
      HCJ_JSX_Updated_By: validatedData.data.HCJ_JSX_Updated_By,
      HCJ_JSX_Audit_Trail: [auditTrail],
    });

    await experience.save();

    return NextResponse.json(
      { message: "Experience added successfully!", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding experience:", error);
    return NextResponse.json(
      { message: "Error adding experience.", error },
      { status: 500 }
    );
  }
}

// Get All

export async function GET(req) {
  try {
    await dbConnect();

    // Extract individual ID from query parameters
    const { searchParams } = new URL(req.url);
    const individualId = searchParams.get("HCJ_JSX_Individual_Id");

    // Validate that individualId is provided
    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    // Fetch only experiences for the specified individual
    const experiences = await Experience.find({ HCJ_JSX_Individual_Id: individualId });

    return NextResponse.json({ success: true, experiences }, { status: 200 });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching experiences", error },
      { status: 500 }
    );
  }
}


