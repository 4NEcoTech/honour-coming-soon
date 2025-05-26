import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualDocuments from "@/app/models/individual_document_details";
import CompanyDetails from "@/app/models/company_details";
import CompanyKYC from "@/app/models/company_kyc_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { sendInstitutionVerificationEmail } from "@/app/utils/SendMail";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


/**
 * @swagger
 * /api/super-admin/v1/hcjArET61042VerifyInstition:
 *   patch:
 *     summary: Verify an institution
 *     description: |
 *       - Verifies an institution by updating the KYC and user verification status.
 *       - Ensures the institution exists and is not already verified.
 *       - Updates the associated company, individual, and user records.
 *     tags: [Super Admin Institution Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institutionId:
 *                 type: string
 *                 example: "65f4b29e28b72a001c35a92b"
 *                 description: "The unique identifier for the institution's KYC record."
 *     responses:
 *       200:
 *         description: Institution verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Institution verified successfully."
 *       400:
 *         description: Bad request (e.g., missing or invalid institution ID, already verified)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Institution ID is required."
 *       404:
 *         description: Institution or related record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Institution KYC record not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 */


export async function PATCH(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized." }),
        { status: 401 }
      );
    }

    const { institutionId } = await req.json();

    if (!institutionId) {
      return new Response(
        JSON.stringify({ success: false, message: "Institution ID is required." }),
        { status: 400 }
      );
    }

    // Step 1: Fetch KYC Record
    const kycRecord = await CompanyKYC.findById(institutionId);
    if (!kycRecord) {
      return new Response(
        JSON.stringify({ success: false, message: "Institution KYC record not found." }),
        { status: 404 }
      );
    }

    if (kycRecord.CKD_Verification_Status === "verified") {
      return new Response(
        JSON.stringify({ success: false, message: "Institution is already verified." }),
        { status: 400 }
      );
    }

    // Step 2: Fetch Company Details
    const companyDetails = await CompanyDetails.findById(kycRecord.CKD_Company_Id);
    if (!companyDetails) {
      return new Response(
        JSON.stringify({ success: false, message: "Company details not found." }),
        { status: 404 }
      );
    }

    // Step 3: Fetch Individual Details
    const individualDetails = await IndividualDetails.findById(companyDetails.CD_Individual_Id);
    if (!individualDetails) {
      return new Response(
        JSON.stringify({ success: false, message: "Individual details not found." }),
        { status: 404 }
      );
    }

    // Step 4: Fetch User
    const user = await User.findById(individualDetails.ID_User_Id);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found for this institution." }),
        { status: 404 }
      );
    }

    // Step 5: Update KYC Status & Verifier
    await CompanyKYC.updateOne(
      { _id: institutionId },
      {
        $set: {
          CKD_Verification_Status: "verified",
          CKD_Verified_By: session.user.id,
        },
      }
    );

    // Step 6: Update Company Status
    await CompanyDetails.updateOne(
      { _id: companyDetails._id },
      { $set: { CD_Company_Status: "01" } }
    );

    // Step 7: Update User Status & Verification
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          UT_User_Verification_Status: "01",
          UT_User_Status: "01",
        },
      }
    );

    // Step 8: Update Individual Status
    await IndividualDetails.updateOne(
      { _id: individualDetails._id },
      { $set: { ID_Individual_Status: "01" } }
    );

    // Step 9: Update All Individual Document Verification Statuses
    await IndividualDocuments.updateMany(
      { IDD_Individual_Id: individualDetails._id },
      { $set: { IDD_Verified1_Status: "01" } }
    );

    // Step 10: Send Verification Email
    const emailSent = await sendInstitutionVerificationEmail(
      user.UT_Email,
      companyDetails.CD_Company_Name
    );

    if (!emailSent) {
      console.error("Email sending failed for:", user.UT_Email);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Institution verified successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying institution:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}


