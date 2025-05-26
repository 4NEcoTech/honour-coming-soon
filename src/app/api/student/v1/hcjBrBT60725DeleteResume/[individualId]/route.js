import { dbConnect } from "@/app/utils/dbConnect";
import HCJStudent from "@/app/models/hcj_student";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60725DeleteResume/{individualId}:
 *   delete:
 *     summary: Delete a student's resume (set to null)
 *     description: This endpoint deletes a student's resume by setting the `HCJ_ST_Resume_Upload` field to `null`.
 *     tags: [Super Admin Student Resume Management]
 *     parameters:
 *       - name: individualId
 *         in: path
 *         description: The unique identifier for the student whose resume is to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *           example: "68087f55b4b11c851713b36f"
 *     responses:
 *       200:
 *         description: Resume successfully nullified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resume deleted (nullified) successfully"
 *       400:
 *         description: Missing individual ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Individual ID is required"
 *       404:
 *         description: Student not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// DELETE resume and set it to null
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { individualId } = await params;

    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const student = await HCJStudent.findOneAndUpdate(
      { HCJ_ST_Individual_Id: individualId },
      { $set: { HCJ_ST_Resume_Upload: null } },
      { new: true }
    );

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume deleted (nullified) successfully",
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
