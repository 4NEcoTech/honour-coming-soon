import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import User from "@/app/models/user_table";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60242AdminProfileImage:
 *   post:
 *     summary: Upload Admin Profile Image
 *     description: Uploads a profile image for the admin user to Google Drive. Allowed formats are JPEG, PNG, and WebP. Max size: 2MB.
 *     tags: [Admin Profile Image Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file to upload (JPEG, PNG, or WebP; max 2MB)
 *               userId:
 *                 type: string
 *                 description: Optional. If not provided, session user ID will be used.
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
 *                 url:
 *                   type: string
 *                   example: https://drive.google.com/your-image-link
 *       400:
 *         description: Missing file, file too large, or invalid file type
 *       401:
 *         description: Unauthorized - session or user ID missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


export const config = {
  api: { bodyParser: false },
};

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const session = await getServerSession(authOptions);
    const userId = formData.get("userId") || session?.user?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }), 
        { status: 401 }
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
    const fileName = `admin_${userId}_profile.${file.name.split(".").pop()}`;
    const url = await uploadToGoogleDrive(buffer, fileName, file.type);

    return new Response(
      JSON.stringify({ success: true, url }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Image upload error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Internal server error",
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}