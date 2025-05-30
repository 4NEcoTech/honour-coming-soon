import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import company_details from "@/app/models/company_details";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60312InstitutionRegistrationImage:
 *   post:
 *     summary: Upload Institution Registration Document
 *     description: |
 *       Uploads a registration document (image or PDF) for an institution and saves it to Google Drive.
 *       Only JPEG, PNG, and PDF formats are allowed. File size must not exceed 2MB.
 *     tags: [Institution Registration Image Upload]
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
 *                 description: Registration document file (JPEG, PNG, or PDF)
 *               companyId:
 *                 type: string
 *                 description: Optional. Company ID of the institution (fetched from session if not provided)
 *     responses:
 *       200:
 *         description: Registration document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *                   example: https://drive.google.com/your-registration-file.pdf
 *       400:
 *         description: Missing file, invalid file type, or file size too large
 *       401:
 *         description: Unauthorized (missing session or companyId)
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error
 */


export const config = {
  api: { bodyParser: false },
};

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(req) {
  await dbConnect();
  const formData = await req.formData();

  const session = await getServerSession(authOptions);
  const companyId = formData.get("companyId") || session?.user?.companyId;

  if (!companyId) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const company = await company_details.findById(companyId);
  if (!company) {
    return new Response(JSON.stringify({ success: false, message: "Company not found" }), { status: 404 });
  }

  const file = formData.get("file");
  if (!file || file.size === 0) {
    return new Response(JSON.stringify({ success: false, message: "No file uploaded" }), { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new Response(JSON.stringify({ success: false, message: "File too large" }), { status: 400 });
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid file type" }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `company_${companyId}_registration.${file.name.split(".").pop()}`;
  const url = await uploadToGoogleDrive(buffer, fileName, file.type);

  return new Response(JSON.stringify({ success: true, url }), { status: 200 });
}
