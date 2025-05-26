import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualDocuments from "@/app/models/individual_document_details";
import { dbConnect } from "@/app/utils/dbConnect";
import { sendUserVerificationEmail } from "@/app/utils/SendMail";
import hcj_student from "@/app/models/hcj_student";
import company_contact_person from "@/app/models/company_contact_person";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61032VerifyAllUsers:
 *   patch:
 *     summary: Verify a user
 *     description: |
 *       - Verifies a user by updating their verification status.
 *       - Ensures the user exists and is not already verified.
 *       - Checks if the user has the required documents before verification.
 *     tags: [All User Verification For Super Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65f4b29e28b72a001c35a92b"
 *                 description: "The unique identifier of the user."
 *     responses:
 *       200:
 *         description: User verified successfully
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
 *                   example: "User verified successfully."
 *       400:
 *         description: Bad request (e.g., missing or invalid user ID, already verified, or missing documents)
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
 *                   example: "User documents are required for verification."
 *       404:
 *         description: User or related record not found
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
 *                   example: "User not found."
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
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required." }),
        { status: 400 }
      );
    }

    //  Step 1: Find User
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    if (user.UT_User_Verification_Status === "01") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User is already verified.",
        }),
        { status: 400 }
      );
    }

    //  Step 2: Fetch Individual Details
    const individualDetails = await IndividualDetails.findOne({
      ID_User_Id: user._id,
    });
    if (!individualDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Individual details not found.",
        }),
        { status: 404 }
      );
    }

    //  Step 3: Ensure User has Documents (Required for Verification)
    const documents = await IndividualDocuments.find({
      IDD_Individual_Id: individualDetails._id,
    });

    if (!documents.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User documents are required for verification.",
        }),
        { status: 400 }
      );
    }

    //  Step 4: Update User Verification Status
    await User.updateOne(
      { _id: userId },
      { $set: { UT_User_Verification_Status: "01",
        UT_User_Status: "01",
       } }
    );

    //  Step 4.1: Update Individual Status to Verified ("01")
    await IndividualDetails.updateOne(
      { _id: individualDetails._id },
      { $set: { ID_Individual_Status: "01" } }
    );

    //  Step 4.2: Update all Documents' Verified Status to "01"
    await IndividualDocuments.updateMany(
      { IDD_Individual_Id: individualDetails._id },
      { $set: { IDD_Verified1_Status: "01" } }
    );

    // 🔍 Step 5: If user is a student (Role: 05), update HCJ_ST_Individual_Id
    if (user.UT_User_Role === "05") {
      const updatedStudent = await hcj_student.updateOne(
        { HCJ_ST_Educational_Email: user.UT_Email },
        { $set: { HCJ_ST_Individual_Id: individualDetails._id } }
      );

      if (updatedStudent.modifiedCount === 0) {
        console.warn("Student record not updated — Email may not match.");
      }
    }

    //  Step 6: If user is a company contact person (Role: 07, 08, 10, 11), update CCP_Individual_Id
    const companyRoles = ["07", "08", "10", "11"];

    if (companyRoles.includes(user.UT_User_Role)) {
      const updatedContact = await company_contact_person.updateOne(
        { CCP_Contact_Person_Email: user.UT_Email.trim().toLowerCase() },
        { $set: { CCP_Individual_Id: individualDetails._id } }
      );

      if (updatedContact.modifiedCount === 0) {
        console.warn(
          "Company Contact record not updated — Email may not match."
        );
      }
    }

    // Step 7: Send Verification Email
    const emailSent = await sendUserVerificationEmail(
      user.UT_Email,
      `${individualDetails.ID_First_Name} ${individualDetails.ID_Last_Name}`.trim()
    );

    if (!emailSent) {
      console.error("Email sending failed for:", user.UT_Email);
    }

    return new Response(
      JSON.stringify({ success: true, message: "User verified successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
