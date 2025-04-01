import { dbConnect } from "@/app/utils/dbConnect";
import hcjSkills from "@/app/models/hcj_skill";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/student/v1/hcjBrBT60891AddSkills
 *   get:
 *     summary: Get all skills or specific individual's skills
 *     description: Retrieves skills based on Individual ID. If no ID is provided, fetches all skills.
 *     responses:
 *       200:
 *         description: A list of skills.
 *       400:
 *         description: Individual ID is required.
 *       404:
 *         description: No skills found.
 *       500:
 *         description: Internal server error.
 *
 *   post:
 *     summary: Add new skills
 *     description: Stores skills associated with a job seeker.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_SKT_Individual_Id:
 *                 type: string
 *                 example: "65d7adfdc9f2a839aafe25c8"
 *               HCJ_SKT_Industry:
 *                 type: string
 *                 example: "Software Development"
 *               HCJ_SKT_Skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js"]
 *               HCJ_SKT_Session_Id:
 *                 type: string
 *                 example: "session_12345"
 *     responses:
 *       201:
 *         description: Skills saved successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

//  POST a new skill
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.json();
    const auditTrail = await generateAuditTrail(req);

    const newSkills = new hcjSkills({
      HCJ_SKT_Individual_Id: formData.HCJ_SKT_Individual_Id,
      HCJ_SKT_Industry: formData.HCJ_SKT_Industry,
      HCJ_SKT_Skills: formData.HCJ_SKT_Skills,
      HCJ_SKT_Session_Id: formData.HCJ_SKT_Session_Id,
      HCJ_SKT_Audit_Trail: [auditTrail],
    });

    await newSkills.save();

    return new Response(
      JSON.stringify({ success: true, message: "Skills saved successfully!" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving skills:", error);
    return new Response(JSON.stringify({ success: false, message: "Error saving skills" }), { status: 500 });
  }
}


//  GET all skills

export async function GET(req) {
  try {
    await dbConnect();

    // Extract Individual ID from query parameters
    const { searchParams } = new URL(req.url);
    const individualId = searchParams.get("HCJ_SKT_Individual_Id");

    let skills;

    if (individualId) {
      // Fetch skills for a specific individual
      skills = await hcjSkills.find({ HCJ_SKT_Individual_Id: individualId });

      if (!skills || skills.length === 0) {
        return NextResponse.json(
          { success: false, message: "No skills found for this Individual ID" },
          { status: 404 }
        );
      }
    } else {
      // Fetch all skills if no Individual ID is provided
      skills = await hcjSkills.find();
    }

    return NextResponse.json({ success: true, skills }, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching skills", error },
      { status: 500 }
    );
  }
}


// export async function GET() {
//   try {
//     await dbConnect();
//     const skills = await hcjSkills.find();
//     return new Response(JSON.stringify({ success: true, skills }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching skills:", error);
//     return new Response(JSON.stringify({ success: false, message: "Error fetching skills" }), { status: 500 });
//   }
// }