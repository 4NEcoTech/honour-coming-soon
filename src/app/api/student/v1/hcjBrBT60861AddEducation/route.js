import { dbConnect } from "@/app/utils/dbConnect";
import IndividualEducation from "@/app/models/individual_education";
import { z } from "zod";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60861AddEducation
 *   get:
 *     summary: Get all education records
 *     tags: [Education]
 *     responses:
 *       200:
 *         description: A list of education records
 *       500:
 *         description: Error retrieving education records
 *
 *   post:
 *     summary: Add a new education record
 *     tags: [Education]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IE_Individual_Id:
 *                 type: string
 *                 description: Individual's ID
 *               IE_Institute_Name:
 *                 type: string
 *                 description: Name of the institute
 *               IE_Program_Name:
 *                 type: string
 *                 description: Name of the program
 *               IE_Specialization:
 *                 type: string
 *                 description: Specialization field
 *               IE_Start_Date:
 *                 type: string
 *                 format: date
 *                 description: Start date of education
 *               IE_End_Date:
 *                 type: string
 *                 format: date
 *                 description: End date of education
 *               IE_Score_Grades:
 *                 type: string
 *                 description: Score or grade
 *               IE_Score_Grades_Value:
 *                 type: number
 *                 description: Grade value
 *     responses:
 *       201:
 *         description: Education record added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */

//  GET: Fetch all education records
export async function GET(req) {
  try {
    await dbConnect();

    // Extract Individual ID from query parameters
    const { searchParams } = new URL(req.url); // Add host to handle URL parsing
    const individualId = searchParams.get("IE_Individual_Id");

    // Validate that individualId is provided
    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    // Fetch education records for the specified individual using IE_Individual_Id
    const educationRecords = await IndividualEducation.find({ IE_Individual_Id: individualId });

    if (!educationRecords || educationRecords.length === 0) {
      return NextResponse.json(
        { success: false, message: "No education records found for this Individual ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, educationRecords }, { status: 200 });
  } catch (error) {
    console.error("Error fetching education records:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching education records", error: error.message },
      { status: 500 }
    );
  }
}



//  POST: Add a new education record
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.json();

    const educationSchema = z.object({
      IE_Individual_Id: z.string().min(1),
      IE_Institute_Name: z.string().min(1),
      IE_Program_Name: z.string().min(1),
      IE_Specialization: z.string().min(1),
      IE_Start_Date: z.string().optional(),
      IE_End_Date: z.string().optional(),
      IE_Year: z.string().optional(),
      IE_Score_Grades: z.string().optional(),
      IE_Score_Grades_Value: z.number().optional(),
    });

    const validatedData = educationSchema.safeParse(formData);

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
    const newEducation = new IndividualEducation({
      ...validatedData.data,
      IE_Audit_Trail: [auditTrail],
    });
    await newEducation.save();

    return NextResponse.json(
      { message: "Education details added successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding education details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}



