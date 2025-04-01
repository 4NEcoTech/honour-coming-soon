import mongoose from "mongoose";
import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import CompanyDetails from "@/app/models/company_details";
import CompanyKYC from "@/app/models/company_kyc_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { sendInstitutionVerificationEmail } from "@/app/utils/SendMail";


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
    const { institutionId } = await req.json();

    if (!institutionId) {
      return new Response(
        JSON.stringify({ success: false, message: "Institution ID is required." }),
        { status: 400 }
      );
    }

    // Step 1: Find KYC record using `institutionId`
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

    //  Step 2: Fetch Company Details using `CKD_Company_Id`
    const companyDetails = await CompanyDetails.findById(kycRecord.CKD_Company_Id);
    if (!companyDetails) {
      return new Response(
        JSON.stringify({ success: false, message: "Company details not found." }),
        { status: 404 }
      );
    }

    //  Step 3: Fetch Individual Details using `CD_Individual_Id`
    const individualDetails = await IndividualDetails.findById(companyDetails.CD_Individual_Id);
    if (!individualDetails) {
      return new Response(
        JSON.stringify({ success: false, message: "Individual details not found." }),
        { status: 404 }
      );
    }

    //  Step 4: Fetch User using `ID_User_Id` (from Individual Details)
    const user = await User.findById(individualDetails.ID_User_Id);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found for this institution." }),
        { status: 404 }
      );
    }

    //  Step 5: Update `CompanyKYC` Verification Status
    await CompanyKYC.updateOne(
      { _id: institutionId },
      { $set: { CKD_Verification_Status: "verified" } }
    );

    //  Step 6: Update `User` Verification Status
    await User.updateOne(
      { _id: user._id },
      { $set: { UT_User_Verification_Status: "01" } }
    );

     // Step 7: Send Verification Email
     const emailSent = await sendInstitutionVerificationEmail(user.UT_Email, companyDetails.CD_Company_Name);

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
