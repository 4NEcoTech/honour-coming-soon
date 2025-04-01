import { NextResponse } from "next/server";
import CompanyContactPerson from "@/app/models/company_contact_person";
import HCJBulkImport from "@/app/models/hcj_bulk_imports";
import HCJStaffInvalid from "@/app/models/company_contact_person_invalid";
import { dbConnect } from "@/app/utils/dbConnect";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { parse } from "csv-parse/sync";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { generateCSVBuffer } from "@/app/utils/csvHelper";


/**
 * @swagger
 * /api/institution/v1/hcjBrBT60582StaffBulkImport:
 *   post:
 *     summary: Bulk import team members
 *     description: |
 *       - Uploads a CSV file containing team member details.
 *       - Validates required fields and formats.
 *       - Converts gender and role values to numeric codes.
 *       - Checks for duplicate email records before insertion.
 *       - Sends registration emails to valid team members.
 *       - Stores invalid records separately for review.
 *     tags: [Team Bulk Import]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "CSV file containing team member details."
 *     responses:
 *       200:
 *         description: Successfully processed the team bulk import.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bulk import completed"
 *                 validCount:
 *                   type: integer
 *                   example: 50
 *                   description: "Number of successfully processed team member records."
 *                 invalidCount:
 *                   type: integer
 *                   example: 5
 *                   description: "Number of invalid team member records."
 *                 duplicateCount:
 *                   type: integer
 *                   example: 8
 *                   description: "Number of duplicate team member records found."
 *       400:
 *         description: Bad request (e.g., no file uploaded, invalid CSV format).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to process bulk import"
 */


//  Role Mapping
const roleMap = {
  "Institution Team Member": "07",
  "Institution Support": "08",
  "Employee Team Member": "10",
  "Employee Support": "11",
};

//  Gender Mapping
const genderMap = {
  Male: "01",
  Female: "02",
  Other: "03",
};

//  Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

//  Function to send registration emails
async function sendTeamRegistrationEmail(teamMember, signupToken) {
  const userLang = "en";
  const roleName = Object.keys(roleMap).find(
    (key) => roleMap[key] === teamMember.CCP_Contact_Person_Role
  );
  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/team-signup?token=${signupToken}`;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: teamMember.CCP_Contact_Person_Email,
    subject: "Invitation to Join Honour Career Junction",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Honour Career Junction!</h2>
        <p>Dear ${teamMember.CCP_Contact_Person_First_Name},</p>
        <p>You've been invited to join Honour Career Junction as a <b>${roleName}</b>.</p>
        <p>Please click the button below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${signupUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Complete Registration</a>
        </div>
        <p>This link will expire in 7 days.</p>
        <p>If you didn't request this invitation, please ignore this email.</p>
      </div>`,
  });
}

//  Function to send emails in batches
async function sendEmailsInChunks(emailPromises, batchSize = 50, delay = 3000) {
  for (let i = 0; i < emailPromises.length; i += batchSize) {
    const batch = emailPromises.slice(i, i + batchSize);
    console.log(` Sending batch ${i + 1} to ${i + batchSize} emails...`);
    await Promise.allSettled(batch);
    if (i + batchSize < emailPromises.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

//  Bulk Import API for Staff Members
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(" Uploading CSV to Google Drive...");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const csvUrl = await uploadToGoogleDrive(buffer, file.name, "text/csv");
    console.log(" CSV Uploaded Successfully:", csvUrl);

    //  Create Bulk Import Record
    const bulkImport = await HCJBulkImport.create({
      fileName: file.name,
      uploadedBy: "Admin",
      csvUrl,
    });

    const bulkImportId = bulkImport._id;

    //  Parse CSV Content
    let records;
    try {
      records = parse(buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
      });
    } catch (error) {
      console.error(" CSV Parsing Error:", error);
      return NextResponse.json(
        { error: "Invalid CSV format" },
        { status: 400 }
      );
    }

    console.log(`Parsed ${records.length} records from CSV`);

    let validTeamMembers = [];
    let invalidTeamMembers = [];
    let duplicateCount = 0;
    let emailPromises = [];

    for (const record of records) {
      let errors = [];

      //  Validate required fields
      const requiredFields = [
        "CCP_Institute_Num",
        "CCP_Institute_Name",
        "CCP_Contact_Person_First_Name",
        "CCP_Contact_Person_Last_Name",
        "CCP_Contact_Person_Email",
        "CCP_Contact_Person_Phone",
        "CCP_Contact_Person_Role",
        "CCP_Contact_Person_Gender",
        "CCP_Contact_Person_DOB",
        "CCP_Contact_Person_Country",
        "CCP_Contact_Person_Pincode",
        "CCP_Contact_Person_State",
        "CCP_Contact_Person_City",
        "CCP_Contact_Person_Address_Line1",
        // "CCP_Contact_Person_Joining_Year",
        // "CCP_Contact_Person_Department",
        // "CCP_Contact_Person_Designation",
      ];

      requiredFields.forEach((field) => {
        if (!record[field] || record[field].toString().trim() === "") {
          errors.push(`${field} is missing`);
        }
      });

      //  Convert Gender to Numeric Format
      if (record.CCP_Contact_Person_Gender in genderMap) {
        record.CCP_Contact_Person_Gender =
          genderMap[record.CCP_Contact_Person_Gender];
      } else {
        errors.push(`Invalid Gender: ${record.CCP_Contact_Person_Gender}`);
      }

      //  Convert Role Name to Code
      if (record.CCP_Contact_Person_Role in roleMap) {
        record.CCP_Contact_Person_Role =
          roleMap[record.CCP_Contact_Person_Role];
      } else {
        errors.push(`Invalid Role: ${record.CCP_Contact_Person_Role}`);
      }

      //  Convert DOB format
      if (!isNaN(Date.parse(record.CCP_Contact_Person_DOB))) {
        record.CCP_Contact_Person_DOB = new Date(record.CCP_Contact_Person_DOB);
      } else {
        errors.push("CCP_Contact_Person_DOB has an invalid date format");
      }

      //  Check for errors
      if (errors.length > 0) {
        invalidTeamMembers.push({ ...record, errors, bulkImportId });
        continue;
      }

      //  Check for duplicate email
      const existingUser = await CompanyContactPerson.findOne({
        CCP_Contact_Person_Email: record.CCP_Contact_Person_Email,
      });

      if (existingUser) {
        duplicateCount++;
        continue;
      }

      //  Generate Signup Token
      const signupToken = jwt.sign({ ...record }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      validTeamMembers.push({ bulkImportId, ...record });

      //  Queue Email
      emailPromises.push(sendTeamRegistrationEmail(record, signupToken));
    }

    //  Insert valid staff members
    if (validTeamMembers.length) {
      await CompanyContactPerson.insertMany(validTeamMembers);
    }

    //  Insert invalid staff members
    if (invalidTeamMembers.length) {
      await HCJStaffInvalid.insertMany(invalidTeamMembers);
      console.log(`Inserted ${invalidTeamMembers.length} invalid team members`);
      const invalidCsvBuffer = generateCSVBuffer(invalidTeamMembers);
      let invalidCsvUrl = await uploadToGoogleDrive(
        invalidCsvBuffer,
        `invalid_${file.name}`,
        "text/csv"
      );
      await HCJBulkImport.findByIdAndUpdate(bulkImportId, {
        invalidCsvUrl,
        invalidCount: invalidTeamMembers.length,
        duplicateCount,
      });
    }

    //  Send Emails in Chunks
    await sendEmailsInChunks(emailPromises);

    return NextResponse.json({
      message: "Bulk import completed",
      validCount: validTeamMembers.length,
      invalidCount: invalidTeamMembers.length,
      duplicateCount: duplicateCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process bulk import", details: error.message },
      { status: 500 }
    );
  }
}
