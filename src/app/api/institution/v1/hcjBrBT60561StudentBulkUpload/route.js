import { NextResponse } from "next/server";
import HCJStudent from "@/app/models/hcj_student";
import HCJStudentInvalid from "@/app/models/hcj_student_invalid";
import HCJBulkImport from "@/app/models/hcj_bulk_imports";
import { dbConnect } from "@/app/utils/dbConnect";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { parse } from "csv-parse/sync";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { generateCSVBuffer } from "@/app/utils/csvHelper";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60561StudentBulkUpload:
 *   post:
 *     summary: Bulk import students
 *     description: |
 *       - Uploads a CSV file containing student details.
 *       - Validates required fields and formats.
 *       - Converts gender values to numeric codes.
 *       - Checks for duplicate email records before insertion.
 *       - Sends registration emails to valid students.
 *       - Stores invalid records separately for review.
 *     tags: [Student Bulk Import]
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
 *                 description: "CSV file containing student details."
 *     responses:
 *       200:
 *         description: Successfully processed the student bulk import.
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
 *                   example: 100
 *                   description: "Number of successfully processed student records."
 *                 invalidCount:
 *                   type: integer
 *                   example: 5
 *                   description: "Number of invalid student records."
 *                 duplicateCount:
 *                   type: integer
 *                   example: 10
 *                   description: "Number of duplicate student records found."
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



// 📌 Gender Mapping
const genderMap = {
  Male: "01",
  Female: "02",
  Other: "03",
};

// 📌 Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Function to Send Emails in Chunks
async function sendEmailsInChunks(emailPromises, batchSize = 50, delay = 3000) {
  for (let i = 0; i < emailPromises.length; i += batchSize) {
    const batch = emailPromises.slice(i, i + batchSize);
    console.log(`📧 Sending batch ${i + 1} to ${i + batchSize} emails...`);
    await Promise.allSettled(batch);
    if (i + batchSize < emailPromises.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 📌 Function to Send Registration Email
async function sendRegistrationEmail(student, signupToken) {
  const userLang = "en"; // Default to English
  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${signupToken}`;

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: student.HCJ_ST_Educational_Email,
    subject: "Complete Your Registration - Honour Career Junction",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Honour Career Junction!</h2>
        <p>Dear ${student.HCJ_ST_Student_First_Name},</p>
        <p>You've been invited to join Honour Career Junction by ${student.HCJ_ST_Institution_Name}.</p>
        <p>Please click the button below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${signupUrl}" style="
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">Complete Registration</a>
        </div>
        <p>This link will expire in 7 days.</p>
        <p>If you didn't request this invitation, please ignore this email.</p>
      </div>
    `,
  });
}

// 📌 Bulk Import API
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📂 Uploading CSV to Google Drive...");

    // ✅ Convert ArrayBuffer to Buffer for Google Drive Upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    // ✅ Upload CSV File to Google Drive
    const csvUrl = await uploadToGoogleDrive(buffer, file.name, "text/csv");

    console.log("✅ CSV Uploaded Successfully:", csvUrl);

    // ✅ Create Bulk Import Record
    const bulkImport = await HCJBulkImport.create({
      fileName: file.name,
      uploadedBy: "Admin",
      csvUrl,
    });

    const bulkImportId = bulkImport._id;

    // ✅ Parse CSV Content
    let records;
    try {
      records = parse(buffer.toString(), { columns: true, skip_empty_lines: true });
    } catch (error) {
      console.error("❌ CSV Parsing Error:", error);
      return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 });
    }

    console.log(`📊 Parsed ${records.length} records from CSV`);

    let validStudents = [];
    let invalidStudents = [];
    let duplicateCount = 0;
    let emailPromises = [];

    for (const record of records) {
      try {
        let errors = [];

        // ✅ Validate required fields
        const requiredFields = [
          "HCJ_ST_InstituteNum", "HCJ_ST_Institution_Name", "HCJ_ST_Student_First_Name",
          "HCJ_ST_Student_Last_Name", "HCJ_ST_Educational_Email", "HCJ_ST_Phone_Number",
          "HCJ_ST_Gender", "HCJ_ST_DOB", "HCJ_ST_Student_Country", "HCJ_ST_Student_Pincode",
          "HCJ_ST_Student_State", "HCJ_ST_Student_City", "HCJ_ST_Address",
          "HCJ_ST_Enrollment_Year", "HCJ_ST_Student_Program_Name",
          "HCJ_ST_Class_Of_Year", "HCJ_ST_Student_Branch_Specialization",
        ];

          // "HCJ_ST_InstituteNum", "HCJ_ST_Institution_Name", "HCJ_ST_Student_First_Name",
          // "HCJ_ST_Student_Last_Name", "HCJ_ST_Educational_Email", "HCJ_ST_Phone_Number",
          // "HCJ_ST_Gender", "HCJ_ST_DOB", "HCJ_ST_Student_Country", "HCJ_ST_Student_Pincode",
          // "HCJ_ST_Student_State", "HCJ_ST_Student_City", "HCJ_ST_Address",
          // "HCJ_ST_Enrollment_Year", "HCJ_ST_Student_Program_Name", "HCJ_ST_Score_Grade_Type",
          // "HCJ_ST_Score_Grade", "HCJ_ST_Student_Document_Domicile", "HCJ_ST_Student_Document_Type",
          // "HCJ_ST_Student_Document_Number", "HCJ_ST_Class_Of_Year", "HCJ_ST_Student_Branch_Specialization",


        requiredFields.forEach(field => {
          if (!record[field] || record[field].toString().trim() === "") {
            errors.push(`${field} is missing`);
          }
        });

        // ✅ Convert Gender to Numeric Format
        if (record.HCJ_ST_Gender in genderMap) {
          record.HCJ_ST_Gender = genderMap[record.HCJ_ST_Gender];
        } else {
          errors.push(`Invalid Gender: ${record.HCJ_ST_Gender}`);
        }

        // ✅ Convert DOB format
        if (!isNaN(Date.parse(record.HCJ_ST_DOB))) {
          record.HCJ_ST_DOB = new Date(record.HCJ_ST_DOB);
        } else {
          errors.push("HCJ_ST_DOB has an invalid date format");
        }

        if (errors.length > 0) {
          console.warn(`⚠️ Invalid Record: ${JSON.stringify(record)} | Errors: ${errors.join(", ")}`);
          invalidStudents.push({ ...record, errors, bulkImportId });
          continue;
        }

        // ✅ Check for Duplicates
        const existingStudent = await HCJStudent.findOne({ HCJ_ST_Educational_Email: record.HCJ_ST_Educational_Email });

        if (existingStudent) {
          duplicateCount++;
          continue;
        }

        // ✅ Generate Signup Token
        const signupToken = jwt.sign({ ...record }, process.env.JWT_SECRET, { expiresIn: "7d" });

        validStudents.push({ bulkImportId, ...record });

        // ✅ Queue Email
        emailPromises.push(sendRegistrationEmail(record, signupToken));

      } catch (error) {
        invalidStudents.push({ row: record, reason: error.message, bulkImportId });
      }
    }

    if (validStudents.length) {
      await HCJStudent.insertMany(validStudents);
      console.log(`✅ Inserted ${validStudents.length} students into HCJStudent`);
    }

    if (invalidStudents.length) {
      await HCJStudentInvalid.insertMany(invalidStudents);
      console.log(`⚠️ Inserted ${invalidStudents.length} students into HCJStudentInvalid`);

      const invalidCsvBuffer = generateCSVBuffer(invalidStudents);
      let invalidCsvUrl = await uploadToGoogleDrive(invalidCsvBuffer, `invalid_${file.name}`, "text/csv");

      await HCJBulkImport.findByIdAndUpdate(bulkImportId, { invalidCsvUrl, invalidCount: invalidStudents.length, duplicateCount });
    }

    // ✅ Send Emails in Chunks
    await sendEmailsInChunks(emailPromises);

    return NextResponse.json({ 
      message: "Bulk import completed",
      validCount: validStudents.length,
      invalidCount: invalidStudents.length,
      duplicateCount: duplicateCount,
    
    });
  } catch (error) {
    console.error("❌ Bulk Import Error:", error);
    return NextResponse.json({ error: "Failed to process bulk import", details: error.message }, { status: 500 });
  }
}
