import IndividualDetails from "@/app/models/individual_details";
import DocumentDetails from "@/app/models/individual_document_details";
import Notification from "@/app/models/Notification";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/student/v1/hcjBrBt60451StudentDocumentCreate:
 *   post:
 *     summary: Save Student Document Details
 *     description: Saves document metadata for a student, including verification status and audit trail. Triggers a notification to the Super Admin for verification.
 *     tags: [Student Documents Data Save in Db]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - IDD_Individual_Id
 *               - IDD_Document1_Domicile
 *               - IDD_Document1_Type
 *               - IDD_Document1_Unq_Identifier
 *               - IDD_Individual1_Document
 *             properties:
 *               IDD_Individual_Id:
 *                 type: string
 *                 description: MongoDB ObjectId of the student’s individual record
 *               IDD_Document1_Domicile:
 *                 type: string
 *                 example: Uttar Pradesh
 *               IDD_Document1_Type:
 *                 type: string
 *                 example: Aadhaar
 *               IDD_Document1_Unq_Identifier:
 *                 type: string
 *                 example: 1234-5678-9012
 *               IDD_Individual1_Document:
 *                 type: string
 *                 format: uri
 *                 example: https://drive.google.com/document-url.pdf
 *     responses:
 *       201:
 *         description: Document details saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 title:
 *                   type: string
 *                   example: Saved Successfully
 *                 code:
 *                   type: string
 *                   example: 6046_7
 *                 message:
 *                   type: string
 *                   example: 6046_7 Document details saved successfully!
 *       400:
 *         description: Validation failed or invalid/missing fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

export async function POST(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const {
      IDD_Individual_Id,
      IDD_Document1_Domicile,
      IDD_Document1_Type,
      IDD_Document1_Unq_Identifier,
      IDD_Individual1_Document,
    } = body;

    // Validate required fields
    const schema = z.object({
      IDD_Individual_Id: z.string().min(1),
      IDD_Document1_Domicile: z.string().min(1),
      IDD_Document1_Type: z.string().min(1),
      IDD_Document1_Unq_Identifier: z.string().min(1),
      IDD_Individual1_Document: z.string().url(),
    });

    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          code: "6046_10",
          title: t("errorCode.6046_10.title"),
          errors: validation.error.errors.map((err) => ({
            path: err.path.join("."),
            message: t("errorCode.6046_10.description", {
              message: err.message,
            }),
          })),
        },
        { status: 400 }
      );
    }

    // Check if valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(IDD_Individual_Id)) {
      return NextResponse.json(
        {
          success: false,
          code: "6046_11",
          title: t("errorCode.6046_11.title"),
          message: t("errorCode.6046_11.description"),
        },
        { status: 400 }
      );
    }

    const user = await IndividualDetails.findById(IDD_Individual_Id).session(
      session
    );
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: "6046_12",
          title: t("errorCode.6046_12.title"),
          message: t("errorCode.6046_12.description"),
        },
        { status: 404 }
      );
    }

    const auditTrail = await generateAuditTrail(req);

    const doc = new DocumentDetails({
      IDD_Individual_Id: user._id,
      IDD_Username: user.ID_Email || user.ID_Phone,
      IDD_Uploaded1_DtTym: new Date(),
      IDD_Uploaded1_By: user.ID_Email || user.ID_Phone,
      IDD_Document1_Domicile,
      IDD_Document1_Type,
      IDD_Document1_Unq_Identifier,
      IDD_Individual1_Document,
      IDD_Verified1_Status: "02",
      IDD_Audit_Trail: [auditTrail],
    });

    await doc.save({ session });

    // Add notification to queue
    const notificationMessage = `User ${
      user.ID_Email || user.ID_Phone
    } uploaded a new document. Please verify the profile.`;
    await Notification.create({
      recipientRole: "02", // Not Verified
      message: notificationMessage,
    });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        success: true,
        code: "6046_13",
        title: t("errorCode.6046_13.title"),
        message: t("errorCode.6046_13.description"),
      },
      { status: 201 }
    );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("📦 Save Error:", err);
    return NextResponse.json(
      {
        success: false,
        code: "6046_10",
        title: t("errorCode.6046_10.title"),
        message: t("errorCode.6046_10.description", { message: err.message }),
      },
      { status: 500 }
    );
  }
}
