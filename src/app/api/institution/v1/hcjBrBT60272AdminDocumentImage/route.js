import { uploadToGoogleDrive } from "@/app/utils/googleDrive";

/**
 * @swagger
 * /api/institution/v1/admin/hcjBrBT60272AdminDocumentImage:
 *   post:
 *     summary: Upload Admin Document Image or PDF
 *     description: |
 *       Uploads an admin document (image or PDF) to Google Drive with filename based on `userId` and `docType`.
 *       Only JPEG, PNG, and PDF formats are allowed. Max file size is 2MB.
 *     tags: [Admin Documents Upload]
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
 *               - userId
 *               - docType
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Document file (JPEG, PNG, or PDF)
 *               userId:
 *                 type: string
 *                 description: Admin user ID
 *               docType:
 *                 type: string
 *                 example: PAN_Card
 *                 description: Type or label of the document
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
 *                   example: https://drive.google.com/your-uploaded-doc.pdf
 *       400:
 *         description: Missing fields, invalid file type, or file too large
 *       500:
 *         description: Upload failed due to server error
 */


export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  
  export async function POST(req) {
    try {
      const formData = await req.formData();
      const file = formData.get("file");
      const userId = formData.get("userId");
      const docType = formData.get("docType");
  
      if (!file || !userId || !docType)
        return new Response(JSON.stringify({ success: false, message: "Missing fields" }), { status: 400 });
  
      if (file.size > MAX_FILE_SIZE)
        return new Response(JSON.stringify({ success: false, message: "File too large" }), { status: 400 });
  
      if (!ACCEPTED_FILE_TYPES.includes(file.type))
        return new Response(JSON.stringify({ success: false, message: "Invalid file type" }), { status: 400 });
  
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeDocType = docType.replace(/\s+/g, "_").toLowerCase();
      const filename = `${userId}_${safeDocType}.${file.name.split(".").pop()}`;
  
      const url = await uploadToGoogleDrive(buffer, filename, file.type);
  
      return new Response(JSON.stringify({ success: true, url }), { status: 200 });
    } catch (err) {
      console.error("Image Upload Error:", err);
      return new Response(JSON.stringify({ success: false, message: "Upload failed" }), { status: 500 });
    }
  }
  