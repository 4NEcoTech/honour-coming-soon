import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import DocumentDetails from "@/app/models/individual_document_details";
import IndividualDetails from "@/app/models/individual_details";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import Notification from "@/app/models/Notification";

/**
 * @swagger
 * /api/student/v1/hcjBrBt60451StudentDocumentCreate:
 *   post:
 *     summary: Upload a user document
 *     description: Uploads a document, stores it in Google Drive, and saves the URL in MongoDB.
 *     tags: [Document Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               IDD_Individual_Id:
 *                 type: string
 *                 description: Individual's ID
 *               IDD_Document1_Domicile:
 *                 type: string
 *                 example: "USA"
 *               IDD_Document1_Type:
 *                 type: string
 *                 example: "01"
 *               IDD_Document1_Unq_Identifier:
 *                 type: string
 *                 example: "ABC1234567"
 *               IDD_Document_File:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

// Validation Schema
const formSchema = z.object({
  IDD_Individual_Id: z.string().min(1, "6046_0 Individual ID is required."),
  IDD_Document1_Domicile: z.string().min(1, "6046_1 Please select a country."),
  IDD_Document1_Type: z.string().min(1, "6046_2 Please select a document type."),
  IDD_Document1_Unq_Identifier: z.string().min(1, "6046_3 Document number is required."),
  IDD_Document_File: z
    .any()
    .refine((file) => file !== null, "6046_4 Document upload is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `6046_5 Max file size is 2MB.`)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), "6046_6 Only .jpg, .jpeg, .png, and .pdf formats are supported."),
});

// Status Constants
const STATUS_NOT_VERIFIED = "02";

export async function POST(req) {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  Parse Form Data
    const formData = await req.formData();
    const data = {
      IDD_Individual_Id: formData.get("IDD_Individual_Id"),
      IDD_Document_File: formData.get("IDD_Document_File"),
      IDD_Document1_Domicile: formData.get("IDD_Document1_Domicile"),
      IDD_Document1_Type: formData.get("IDD_Document1_Type"),
      IDD_Document1_Unq_Identifier: formData.get("IDD_Document1_Unq_Identifier"),
    };

    //  Validate Form Data
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

  // console.log(data.IDD_Individual_Id, "IDD_Individual_Id")

    //  Step 1: Find User in `individual_details` Collection
    const user = await IndividualDetails.findOne({ _id: data.IDD_Individual_Id }).session(session);
   
  // console.log(user, "user")
  // console.log(data.IDD_Individual_Id, "IDD_Individual_Id")
    if (!user) {
      await session.abortTransaction();
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    //  Step 2: Upload Image to Google Drive
    let fileUrl = null;
    if (data.IDD_Document_File) {
      const buffer = Buffer.from(await data.IDD_Document_File.arrayBuffer());
      const fileName = data.IDD_Document_File.name.replaceAll(" ", "_");
      const mimeType = data.IDD_Document_File.type;
      fileUrl = await uploadToGoogleDrive(buffer, fileName, mimeType);
    }

    //  Step 3: Generate Audit Trail
    const auditTrail = await generateAuditTrail(req);

    //  Step 4: Save Document Details Using Foreign Key
    const documentDetails = new DocumentDetails({
      IDD_Individual_Id: user._id,
      IDD_Username: user.ID_Email || user.ID_Phone, // Default to email, fallback to phone
      IDD_Uploaded1_DtTym: new Date(),
      IDD_Uploaded1_By: user.ID_Email || user.ID_Phone,
      IDD_Document1_Domicile: data.IDD_Document1_Domicile,
      IDD_Document1_Type: data.IDD_Document1_Type,
      IDD_Document1_Unq_Identifier: data.IDD_Document1_Unq_Identifier,
      IDD_Individual1_Document: fileUrl || null,
      IDD_Verified1_Status: "02", // Default status: Not verified
      IDD_Audit_Trail: [auditTrail],
    });

    await documentDetails.save({ session });

    //  Save Notification
    const notificationMessage = `User ${user.ID_Email || user.ID_Phone} uploaded a new document. Please verify the profile.`;
    await Notification.create({
      recipientRole: STATUS_NOT_VERIFIED,
      message: notificationMessage,
    });

    //  Commit MongoDB Transaction
    await session.commitTransaction();
    session.endSession();

    //  Return Success Response
    return NextResponse.json(
      {
        success: true,
        title: "Saved Successfully",
        code: "6046_7",
        message: "6046_7 Document details saved successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error handling the request:", error);
    return NextResponse.json(
      {
        success: false,
        title: "Error",
        code: "6046_8",
        message: "6046_8 Error processing the request.",
      },
      { status: 500 }
    );
  }
}
