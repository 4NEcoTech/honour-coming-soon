import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import HCJStudent from "@/app/models/hcj_student";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60721AddResume:
 *   patch:
 *     summary: Upload or Overwrite Resume to Google Drive
 *     description: Uploads a resume file for a student to Google Drive. Supports PDF, DOC, DOCX up to 5MB. Automatically overwrites if file already exists.
 *     tags: [Add and Update Student Resume]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Optional. If not provided, the session user ID will be used.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF, DOC, or DOCX only, max 5MB)
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
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
 *                   example: Resume uploaded successfully
 *                 url:
 *                   type: string
 *                   example: https://drive.google.com/your-resume-link
 *       400:
 *         description: Missing or invalid file, file too large, or unsupported format
 *       401:
 *         description: Unauthorized (no userId or session)
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal Server Error
 */


export const config = {
  api: { bodyParser: false },
};

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function PATCH(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // Step 1: Get session or individualId
    const session = await getServerSession(authOptions);
    const individualId = formData.get("userId") || session?.user?.id;

    if (!individualId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Step 2: Find student by Individual ID
    const student = await HCJStudent.findOne({
      HCJ_ST_Individual_Id: individualId,
    });

    if (!student) {
      return new Response(
        JSON.stringify({ success: false, message: "Student not found" }),
        { status: 404 }
      );
    }

    // Step 3: Validate uploaded file
    const file = formData.get("file");
    if (!file || file.size === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No file uploaded" }),
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, message: "File size exceeds 5MB" }),
        { status: 400 }
      );
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Only PDF, DOC, and DOCX files are allowed",
        }),
        { status: 400 }
      );
    }

    // Step 4: Upload or overwrite file to Google Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `resume_${individualId}`; //  Fixed file name (no extension)

    const fileUrl = await uploadToGoogleDrive(buffer, fileName, file.type);

    // Step 5: Save updated Google Drive URL to database
    student.HCJ_ST_Resume_Upload = fileUrl;
    await student.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Resume uploaded successfully",
        url: fileUrl,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Resume upload error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
