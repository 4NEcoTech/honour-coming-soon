import { dbConnect } from "@/app/utils/dbConnect";
import {
  Experience,
  experienceSchemaZod,
} from "@/app/models/hcj_job_seeker_experience";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60921AddWorkExperience/[id]:
 *   get:
 *     summary: Get a single work experience
 *     description: Retrieves a single experience record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Experience retrieved successfully.
 *       404:
 *         description: Experience not found.
 *       500:
 *         description: Error fetching experience.
 *
 *   patch:
 *     summary: Update a single work experience
 *     description: Updates an existing experience by its ID.
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
 *         description: Experience updated successfully.
 *       404:
 *         description: Experience not found.
 *       500:
 *         description: Error updating experience.
 *
 *   delete:
 *     summary: Delete a single work experience
 *     description: Deletes an experience by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Experience deleted successfully.
 *       404:
 *         description: Experience not found.
 *       500:
 *         description: Error deleting experience.
 */

// Single Get

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return NextResponse.json(
        { success: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, experience }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching experience.", error },
      { status: 500 }
    );
  }
}

// SIngle Update



export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const formData = await req.json();

    //  Allow Partial Updates (Important)
    const validatedData = experienceSchemaZod.partial().safeParse(formData);

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

    //  Create an object with only the fields that need updating
    const updateFields = {};

    if (validatedData.data.HCJ_JSX_Company_Name)
      updateFields.HCJ_JSX_Company_Name = validatedData.data.HCJ_JSX_Company_Name;
    if (validatedData.data.HCJ_JSX_Start_Date)
      updateFields.HCJ_JSX_Start_Date = new Date(validatedData.data.HCJ_JSX_Start_Date);
    if (validatedData.data.HCJ_JSX_End_Date)
      updateFields.HCJ_JSX_End_Date = validatedData.data.HCJ_JSX_Currently_Working
        ? null
        : new Date(validatedData.data.HCJ_JSX_End_Date);
    if (validatedData.data.HCJ_JSX_Currently_Working !== undefined)
      updateFields.HCJ_JSX_Currently_Working = validatedData.data.HCJ_JSX_Currently_Working;
    if (validatedData.data.HCJ_JSX_Job_Description)
      updateFields.HCJ_JSX_Job_Description = validatedData.data.HCJ_JSX_Job_Description;
    if (validatedData.data.HCJ_JSX_Job_Title)
      updateFields.HCJ_JSX_Job_Title = validatedData.data.HCJ_JSX_Job_Title;
    if (validatedData.data.HCJ_JSX_Country)
      updateFields.HCJ_JSX_Country = validatedData.data.HCJ_JSX_Country;
    if (validatedData.data.HCJ_JSX_State)
      updateFields.HCJ_JSX_State = validatedData.data.HCJ_JSX_State;
    if (validatedData.data.HCJ_JSX_City)
      updateFields.HCJ_JSX_City = validatedData.data.HCJ_JSX_City;
    if (validatedData.data.HCJ_JSX_Work_Mode)
      updateFields.HCJ_JSX_Work_Mode = validatedData.data.HCJ_JSX_Work_Mode;
    if (validatedData.data.HCJ_JSX_Employement_Type)
      updateFields.HCJ_JSX_Employement_Type = validatedData.data.HCJ_JSX_Employement_Type;
    if (validatedData.data.HCJ_JSX_Updated_By)
      updateFields.HCJ_JSX_Updated_By = validatedData.data.HCJ_JSX_Updated_By;

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      {
        $set: updateFields,
        $push: { HCJ_JSX_Audit_Trail: auditTrail },
      },
      { new: true }
    );

    if (!updatedExperience) {
      return NextResponse.json(
        { success: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updatedExperience }, { status: 200 });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { message: "Error updating experience.", error: error.message },
      { status: 500 }
    );
  }
}


// Single Delete

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedExperience = await Experience.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Experience deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting experience.", error },
      { status: 500 }
    );
  }
}
