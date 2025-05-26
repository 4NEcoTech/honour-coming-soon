import IndividualDetails from "@/app/models/individual_details";
import DocumentDetails from "@/app/models/individual_document_details";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60271AdminDocument:
 *   post:
 *     summary: Submit a Admin Document Record
 *     description: |
 *       Saves a new document record for a Admin, including domicile, document type, unique identifier, and URL.
 *       Stores an audit trail entry and sets the verification status to pending (`02`).
 *     tags: [Admin Documents Saved]
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
 *                 description: MongoDB ObjectId of the individual
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
 *                 example: https://drive.google.com/path-to-document
 *     responses:
 *       201:
 *         description: Document record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Document saved
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Individual not found
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

    if (
      !IDD_Individual_Id ||
      !IDD_Document1_Domicile ||
      !IDD_Document1_Type ||
      !IDD_Document1_Unq_Identifier ||
      !IDD_Individual1_Document
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "6027_5",
          title: t(`errorCode.6027_5.title`),
          message: t(`errorCode.6027_5.description`),
        }),
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(IDD_Individual_Id)) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "6027_6",
          title: t(`errorCode.6027_6.title`),
          message: t(`errorCode.6027_6.description`),
        }),
        { status: 400 }
      );
    }

    const user = await IndividualDetails.findById(IDD_Individual_Id).session(
      session
    );

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "6027_7",
          title: t(`errorCode.6027_7.title`),
          message: t(`errorCode.6027_7.description`),
        }),
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
    await session.commitTransaction();
    session.endSession();

    return new Response(
      JSON.stringify({
        success: true,
        code: "6027_8",
        title: t(`errorCode.6027_8.title`),
        message: t(`errorCode.6027_8.description`),
      }),

      { status: 201 }
    );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Submit Error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        code: "6027_9",
        title: t(`errorCode.6027_9.title`),
        message: t(`errorCode.6027_9.description`, {
          message: err.message,
        }),
      }),
      { status: 500 }
    );
  }
}
