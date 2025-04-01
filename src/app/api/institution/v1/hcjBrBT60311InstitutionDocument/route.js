import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import company_details from "@/app/models/company_details";
import CompanyKYCDetails from "@/app/models/company_kyc_details";
import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60311InstitutionDocument:
 *   post:
 *     summary: Submit Company KYC Documents
 *     description: Submits KYC documents for an AICTE or Non-AICTE affiliated institution.
 *     tags: [Company KYC]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               UT_User_Id:
 *                 type: string
 *                 example: "admin@university.com"
 *               CKD_Institution_Type:
 *                 type: string
 *                 enum: ["AICTE", "Non-AICTE"]
 *                 example: "AICTE"
 *               CKD_Company_Registration_Number:
 *                 type: string
 *                 example: "GST123456789"
 *               CKD_Company_Tax_Id:
 *                 type: string
 *                 example: "TAX987654321"
 *               CKD_Company_Registration_Documents:
 *                 type: string
 *                 format: binary
 *               CKD_Company_Tax_Documents:
 *                 type: string
 *                 format: binary
 *               CKD_Submitted_By:
 *                 type: string
 *                 example: "admin@university.com"
 *     responses:
 *       201:
 *         description: KYC details submitted successfully
 *       400:
 *         description: Invalid or missing fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */



export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

     const sessions = await getServerSession(authOptions);
        const sessionId = formData.get("CKD_Company_Id") || sessions?.user?.companyId;
    
        // Check if sessionId is available
        if (!sessionId) {
          return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
          );
        }

    // Find user
    const companyDetails = await company_details.findOne({ _id: sessionId });



    if (!companyDetails) {
      return new Response(
        JSON.stringify({ success: false, message: "Company Details not found" }),
        { status: 404 }
      );
    }

    let registrationDocUrl = null;
    let taxDocUrl = null;

    if (formData.has("CKD_Company_Registration_Documents")) {
      const regDocBuffer = Buffer.from(
        await formData.get("CKD_Company_Registration_Documents").arrayBuffer()
      );
      registrationDocUrl = await uploadToGoogleDrive(
        regDocBuffer,
        `registration_${Date.now()}.pdf`,
        "application/pdf"
      );
    }

    if (formData.has("CKD_Company_Tax_Documents")) {
      const taxDocBuffer = Buffer.from(
        await formData.get("CKD_Company_Tax_Documents").arrayBuffer()
      );
      taxDocUrl = await uploadToGoogleDrive(
        taxDocBuffer,
        `tax_${Date.now()}.pdf`,
        "application/pdf"
      );
    }

    // Generate a unique KYC Number
    const kycNumber = uuidv4();

    // Start MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create KYC document details
      const companyKYC = new CompanyKYCDetails({
        CKD_KYCNum: kycNumber,
        CKD_Company_Id: companyDetails._id,
        CKD_Institution_Type: formData.get("CKD_Institution_Type"),
        CKD_AISHE_Code: formData.get("CKD_AISHE_Code"),
        CKD_College_Name: formData.get("CKD_College_Name"),
        CKD_College_Name_Other: formData.get("CKD_College_Name_Other"),
        CKD_Affiliated_University: formData.get("CKD_Affiliated_University"),
        CKD_Affiliated_University_Other: formData.get("CKD_Affiliated_University_Other"),
        CKD_University_Name: formData.get("CKD_University_Name"),
        CKD_University_Name_Other: formData.get("CKD_University_Name_Other"),
        CKD_University_Type: formData.get("CKD_University_Type"),
        CKD_Company_Registration_Number: formData.get("CKD_Company_Registration_Number"),
        CKD_Company_Tax_Id: formData.get("CKD_Company_Tax_Id"),
        CKD_Company_Registration_Documents: registrationDocUrl,
        CKD_Company_Tax_Documents: taxDocUrl,
        CKD_Submitted_By: formData.get("CKD_Submitted_By"),
        CKD_Verification_Status: "submitted",
        CKD_Audit_Trail: JSON.parse(formData.get("CKD_Audit_Trail") || "[]"),
      });

      await companyKYC.save({ session });
      await session.commitTransaction();
      session.endSession();

      return new Response(
        JSON.stringify({
          success: true,
          message: "KYC details submitted successfully!",
          kycNumber,
        }),
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction Error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Database transaction failed",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during KYC submission:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}




