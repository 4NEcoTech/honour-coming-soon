import DocumentDetails from "@/app/models/individual_document_details";
import IndividualDetails from "@/app/models/individual_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import mongoose from "mongoose";
import { generateAuditTrail } from "@/app/utils/audit-trail";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60271AdminDocument:
 *   post:
 *     summary: Upload Institution Administrator Document
 *     description: Uploads an administrator's document, stores it in Google Drive, and saves the URL in MongoDB.
 *     tags: [Institution Administrator Document Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               IDD_Individual_Id:
 *                 type: string
 *                 description: Administrator's ID
 *                 example: "60f7b2c8f5a1d6123c8b4567"
 *               IDD_Document1_Domicile:
 *                 type: string
 *                 description: Document domicile country
 *                 example: "IND"
 *               IDD_Document1_Type:
 *                 type: string
 *                 description: Type of document (e.g., Aadhaar, PAN, Passport)
 *                 example: "Aadhaar"
 *               IDD_Document1_Unq_Identifier:
 *                 type: string
 *                 description: Unique identifier for the document
 *                 example: "XXXX-XXXX-9876"
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
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export async function POST(req) {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Remove `await req.text()`
    // console.log(" Raw Request Body:", await req.text()); //  THIS WAS THE PROBLEM

    const formData = await req.formData(); //  Reading the form data only once
  //  console.log("Parsed Form Data:", formData); //  Debugging form data

    const data = {
      IDD_Individual_Id: formData.get("IDD_Individual_Id"),
      IDD_Document_File: formData.get("IDD_Document_File"),
      IDD_Document1_Domicile: formData.get("IDD_Document1_Domicile"),
      IDD_Document1_Type: formData.get("IDD_Document1_Type"),
      IDD_Document1_Unq_Identifier: formData.get(
        "IDD_Document1_Unq_Identifier"
      ),
    };

  //  console.log("🔍 Extracted Data:", data);

    //  Validate required fields
    if (
      !data.IDD_Individual_Id ||
      !data.IDD_Document1_Domicile ||
      !data.IDD_Document1_Type ||
      !data.IDD_Document1_Unq_Identifier ||
      !data.IDD_Document_File
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Step 1: Find the user in `individual_details`
    const user = await IndividualDetails.findOne({
      _id: data.IDD_Individual_Id,
    }).session(session);

  //  console.log("👤 User found:", user);

    if (!user) {
      await session.abortTransaction();
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Step 2: Upload document to Google Drive
    let fileUrl = null;
    if (data.IDD_Document_File) {
      console.log("📤 Uploading file:", {
        name: data.IDD_Document_File.name,
        type: data.IDD_Document_File.type,
        size: data.IDD_Document_File.size,
      });

      if (data.IDD_Document_File.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "File size exceeds 2MB limit.",
          }),
          { status: 400 }
        );
      }

      if (!ACCEPTED_FILE_TYPES.includes(data.IDD_Document_File.type)) {
        return new Response(
          JSON.stringify({
            success: false,
            message:
              "Invalid file type. Only .jpg, .jpeg, .png, and .pdf are allowed.",
          }),
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await data.IDD_Document_File.arrayBuffer());
      const fileName = data.IDD_Document_File.name.replaceAll(" ", "_");
      const mimeType = data.IDD_Document_File.type;

      fileUrl = await uploadToGoogleDrive(buffer, fileName, mimeType);
    //  console.log("File URL:", fileUrl);
    }

    //  Step 3: Generate Audit Trail
    const auditTrail = await generateAuditTrail(req);

    //  Step 4: Save document details in MongoDB
    const documentDetails = new DocumentDetails({
      IDD_Individual_Id: user._id,
      IDD_Username: user.ID_Email || user.ID_Phone,
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

    //  Commit MongoDB Transaction
    await session.commitTransaction();
    session.endSession();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Document uploaded successfully!",
        documentUrl: fileUrl,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(" Error during document upload:", error);

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
