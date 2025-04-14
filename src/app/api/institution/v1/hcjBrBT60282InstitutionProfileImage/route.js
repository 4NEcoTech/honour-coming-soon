import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import IndividualDetails from "@/app/models/individual_details";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60282InstitutionProfileImage:
 *   post:
 *     summary: Upload Institution Logo
 *     description: |
 *       Uploads the institution's logo image to Google Drive. Only JPEG, PNG, and WebP formats are allowed. File size must not exceed 2MB.
 *       The uploaded file is renamed using the institution's individual ID for consistent reference.
 *     tags: [Institution Profile Image Upload]
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
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Institution logo file (JPEG, PNG, WebP)
 *               individualId:
 *                 type: string
 *                 description: Optional. Individual ID of the institution (used if session is missing).
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
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
 *                   example: https://drive.google.com/your-logo-image
 *       400:
 *         description: Missing file, invalid type, or size exceeded
 *       401:
 *         description: Unauthorized - missing session or individual ID
 *       404:
 *         description: Institution user not found
 *       500:
 *         description: Internal server error
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
    const individualId = formData.get("individualId") || session?.user?.individualId;

    if (!individualId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const user = await IndividualDetails.findById(individualId);
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
    const fileExtension = file.name.split(".").pop();
    const fileName = `institution_logo_${individualId}.${fileExtension}`;
    const url = await uploadToGoogleDrive(buffer, fileName, file.type);

    return new Response(
      JSON.stringify({ success: true, url }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Company logo upload error:", error);
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
