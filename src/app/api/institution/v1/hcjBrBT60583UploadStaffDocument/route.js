import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60581UploadStaffDocument:
 *   post:
 *     summary: Upload staff document image
 *     description: Uploads a staff document image to Google Drive and returns the URL
 *     tags: [Team Member/Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: The document image file to upload
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documentUrl:
 *                   type: string
 *                   description: URL of the uploaded document
 *       400:
 *         description: No document provided
 *       500:
 *         description: Server error
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const document = formData.get("file");

    if (!document || !(document instanceof File)) {
      return NextResponse.json(
        { error: "No document provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await document.arrayBuffer());
    const filename = `staff_document_${Date.now()}_${document.name}`;
    const documentUrl = await uploadToGoogleDrive(
      buffer,
      filename,
      document.type
    );

    return NextResponse.json({ url: documentUrl }, { status: 201 });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      {
        error: "Failed to upload document",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
