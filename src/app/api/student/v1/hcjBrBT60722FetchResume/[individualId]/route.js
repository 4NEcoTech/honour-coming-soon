import { dbConnect } from "@/app/utils/dbConnect";
import HCJStudent from "@/app/models/hcj_student";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60722FetchResume/{individualId}:
 *   get:
 *     summary: Get Student Resume URL
 *     description: Fetches the uploaded resume URL for a student using their individual ID.
 *     tags: [Fetch Student Resume]
 *     parameters:
 *       - in: path
 *         name: individualId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the student’s individual profile
 *     responses:
 *       200:
 *         description: Resume URL fetched successfully
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
 *                   example: Resume URL fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     resumeUrl:
 *                       type: string
 *                       example: https://drive.google.com/your-resume.pdf
 *       400:
 *         description: Individual ID is required
 *       404:
 *         description: Student not found or resume not uploaded
 *       500:
 *         description: Internal Server Error
 */


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const params1 = await params;
    const { individualId } = params1;

    if (!individualId) {
      return NextResponse.json(
        { success: false, message: "Individual ID is required" },
        { status: 400 }
      );
    }

    const student = await HCJStudent.findOne({
      HCJ_ST_Individual_Id: individualId,
    }).lean();

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    if (!student.HCJ_ST_Resume_Upload) {
      return NextResponse.json(
        { success: false, message: "Resume not uploaded yet" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume URL fetched successfully",
      data: {
        resumeUrl: student.HCJ_ST_Resume_Upload,
      },
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
