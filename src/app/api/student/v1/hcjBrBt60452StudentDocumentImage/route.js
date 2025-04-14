import { uploadToGoogleDrive } from "@/app/utils/googleDrive";

/**
 * @swagger
 * /api/student/v1/hcjBrBt60452StudentDocumentImage:
 *   post:
 *     summary: Upload a Document (Image or PDF) to Google Drive
 *     description: Uploads a document (image or PDF) to Google Drive with a filename based on userId and docType. Accepted types: JPEG, JPG, PNG, PDF. Max size: 2MB.
 *     tags: [Student Documents Image Upload]
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
 *                 description: File to be uploaded (image or PDF, max 2MB)
 *               userId:
 *                 type: string
 *                 description: Unique ID of the user uploading the file
 *               docType:
 *                 type: string
 *                 description: Type of the document (e.g., Aadhaar, PAN, Marksheet)
 *     responses:
 *       200:
 *         description: File uploaded successfully
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
 *                   example: https://drive.google.com/your-uploaded-file-link
 *       400:
 *         description: Missing fields, invalid file type, or file too large
 *       500:
 *         description: Upload failed or internal server error
 */


export const config = {
  api: {
    bodyParser: false,
  },
};

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");
    const docType = formData.get("docType");

    if (!file || !userId || !docType) {
      return new Response(JSON.stringify({ success: false, message: "Missing fields" }), { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ success: false, message: "File too large" }), { status: 400 });
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid file type" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeDocType = docType.replace(/\s+/g, "_").toLowerCase();
    const filename = `${userId}_${safeDocType}.${file.name.split(".").pop()}`;

    const url = await uploadToGoogleDrive(buffer, filename, file.type);

    return new Response(JSON.stringify({ success: true, url }), { status: 200 });
  } catch (err) {
    console.error("📤 File Upload Error:", err);
    return new Response(JSON.stringify({ success: false, message: "Upload failed" }), { status: 500 });
  }
}
