import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/utils/dbConnect";
import company_details from "@/app/models/company_details";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60313InstitutionTaxImage:
 *   post:
 *     summary: Upload Institution Tax Document
 *     description: |
 *       Uploads a tax-related document (image or PDF) for an institution and stores it in Google Drive.
 *       Only JPEG, PNG, and PDF files are supported. Maximum allowed file size is 2MB.
 *     tags: [Institution Tax Image Upload]
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
 *                 description: Tax document file (JPEG, PNG, or PDF)
 *               companyId:
 *                 type: string
 *                 description: Optional. Company ID of the institution (fetched from session if not provided)
 *     responses:
 *       200:
 *         description: Tax document uploaded successfully
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
 *                   example: https://drive.google.com/company_tax_document.pdf
 *       400:
 *         description: Missing file, invalid file type, or file too large
 *       401:
 *         description: Unauthorized (missing session or company ID)
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
  const fileName = `company_${companyId}_tax.${file.name.split(".").pop()}`;
  const url = await uploadToGoogleDrive(buffer, fileName, file.type);

  return new Response(JSON.stringify({ success: true, url }), { status: 200 });
}
