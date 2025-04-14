import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import User from "@/app/models/user_table";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60422StudentProfileImage:
 *   post:
 *     summary: Upload Student Profile or Cover Image
 *     description: Uploads either a profile or cover image for a student to Google Drive. Supported file types: JPEG, PNG, WebP. Max file size: 2MB.
 *     tags: [Student Profile Image Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (JPEG, PNG, WebP)
 *               userId:
 *                 type: string
 *                 description: Optional. If not provided, the session user ID is used.
 *               type:
 *                 type: string
 *                 enum: [profile, cover]
 *                 description: Indicates whether the image is for profile or cover
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 type:
 *                   type: string
 *                   example: profile
 *                 url:
 *                   type: string
 *                   example: https://drive.google.com/your-uploaded-image-url
 *       400:
 *         description: Missing or invalid fields, file too large, or invalid file type
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


export const config = {
  api: { bodyParser: false },
};

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const session = await getServerSession(authOptions);
    const userId = formData.get("userId") || session?.user?.id;
    const type = formData.get("type"); // 'profile' or 'cover'

    if (!userId || !["profile", "cover"].includes(type)) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing or invalid fields" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const file = formData.get("file");
    if (!file || file.size === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No file uploaded" }),
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, message: "File size exceeds 2MB limit" }),
        { status: 400 }
      );
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Only JPEG, PNG, and WebP images are allowed"
        }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop();
    const fileName = `student_${userId}_${type}.${extension}`;
    const url = await uploadToGoogleDrive(buffer, fileName, file.type);

    return new Response(
      JSON.stringify({ success: true, type, url }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Student image upload error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
