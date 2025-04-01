import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import hcj_job_seeker_languages from "@/app/models/hcj_job_seeker_languages";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60871AddLanguage:
 *   post:
 *     summary: Add or update user languages
 *     description: Stores all user languages in a single document, with languages as an array of objects.
 *     tags: [Languages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_JSL_Job_Seeker_Id:
 *                 type: string
 *                 example: "65d7adfdc9f2a839aafe25c8"
 *               HCJ_JSL_Languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     HCJ_JSL_Language:
 *                       type: string
 *                       example: "English"
 *                     HCJ_JSL_Language_Proficiency_Level:
 *                       type: number
 *                       example: 4
 *                     HCJ_JSL_Language_Proficiency:
 *                       type: string
 *                       example: "Advanced"
 *     responses:
 *       200:
 *         description: Languages updated successfully
 *       201:
 *         description: Languages added successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Error processing the request
 */

//  Define Language Schema for Validation
const languageSchema = z.object({
  HCJ_JSL_Job_Seeker_Id: z.string().min(1, "Job Seeker ID is required"),
  HCJ_JSL_Languages: z.array(
    z.object({
      HCJ_JSL_Language: z.string().min(1, "Language is required"),
      HCJ_JSL_Language_Proficiency_Level: z.number().min(1).max(5),
      HCJ_JSL_Language_Proficiency: z.enum(["Basic", "Intermediate", "Advanced"]),
    })
  ),
});

//  Middleware for Error Handling
const handleErrors = (error, message) => {
  console.error(message, error);
  return NextResponse.json({ success: false, message }, { status: 500 });
};

//  Connect to Database
await dbConnect();

//  POST - Add or Update Job Seeker Languages
export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const formData = await req.json();
    const validation = languageSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { HCJ_JSL_Job_Seeker_Id, HCJ_JSL_Languages } = validation.data;
    const auditTrail = await generateAuditTrail(req);

    //  Check if Job Seeker already exists
    const existingUser = await hcj_job_seeker_languages.findOne({ HCJ_JSL_Job_Seeker_Id }).session(session);

    if (existingUser) {
      existingUser.HCJ_JSL_Languages = HCJ_JSL_Languages;
      existingUser.HCJ_JSL_Audit_Trail.push(auditTrail);
      await existingUser.save({ session });
    } else {
      const newUser = new hcj_job_seeker_languages({
        HCJ_JSL_Job_Seeker_Id,
        HCJ_JSL_Languages,
        HCJ_JSL_Audit_Trail: [auditTrail],
      });
      await newUser.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        success: true,
        title: "Languages saved successfully",
        code: "6044_7",
        message: "6044_7 All languages have been successfully stored",
      },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleErrors(error, "Error saving languages");
  }
}


