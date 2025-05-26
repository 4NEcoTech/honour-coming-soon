import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getTranslator } from "@/i18n/server";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /institution/v1/hcjBrBT60551UploadStudentPhoto:
 *   post:
 *     summary: Upload student photo
 *     description: Uploads a student photo to Google Drive and returns the URL
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photoUrl:
 *                   type: string
 *                   description: URL of the uploaded photo
 *       400:
 *         description: No photo provided
 *       500:
 *         description: Server error
 */
export async function POST(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    const formData = await req.formData();
    const photo = formData.get("photo");

    if (!photo || !(photo instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_24",
          title: t("errorCode.6055_24.title"),
          message: t("errorCode.6055_24.description"),
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    const filename = `student_photo_${Date.now()}_${photo.name}`;
    const photoUrl = await uploadToGoogleDrive(buffer, filename, photo.type);

    return NextResponse.json(
      {
        success: true,
        code: "6055_25",
        title: t("errorCode.6055_25.title"),
        message: t("errorCode.6055_25.description"),
        data: photoUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      {
        success: true,
        code: "6055_26",
        title: t("errorCode.6055_26.title"),
        message: t("errorCode.6055_26.description", {
          message:error.message
        }),
      },
      { status: 500 }
    );
  }
}
