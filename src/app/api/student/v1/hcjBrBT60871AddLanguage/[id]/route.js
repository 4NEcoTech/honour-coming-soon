import { NextResponse } from "next/server";
import hcj_job_seeker_languages from "@/app/models/hcj_job_seeker_languages";
import { dbConnect } from "@/app/utils/dbConnect";
import { z } from "zod";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60871AddLanguage/[id]
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Languages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user
 * 
 *   patch:
 *     summary: Update a user's languages
 *     tags: [Languages]
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
 *               HCJ_JSL_Languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     HCJ_JSL_Language:
 *                       type: string
 *                     HCJ_JSL_Language_Proficiency_Level:
 *                       type: number
 *                     HCJ_JSL_Language_Proficiency:
 *                       type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */

const languageSchema = z.object({
  HCJ_JSL_Languages: z.array(
    z.object({
      HCJ_JSL_Language: z.string().min(1, "Language is required"),
      HCJ_JSL_Language_Proficiency_Level: z.number().min(1).max(5),
      HCJ_JSL_Language_Proficiency: z.enum(["Basic", "Intermediate", "Advanced"]),
    })
  ),
});

//  GET single user
export async function GET(_, { params }) {
  try {
    await dbConnect();
    const user = await hcj_job_seeker_languages.findById(params.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return handleErrors(error, "Error fetching user");
  }
}

//  PATCH update user languages
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const formData = await req.json();
    const validation = languageSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }

    const user = await hcj_job_seeker_languages.findByIdAndUpdate(params.id, validation.data, { new: true });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error) {
    return handleErrors(error, "Error updating user");
  }
}

//  DELETE user
export async function DELETE(_, { params }) {
  try {
    await dbConnect();
    const user = await hcj_job_seeker_languages.findByIdAndDelete(params.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return handleErrors(error, "Error deleting user");
  }
}

