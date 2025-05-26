// import { NextResponse } from "next/server";
// import HCJStudent from "@/app/models/hcj_student";
// import HCJStudentInvalid from "@/app/models/hcj_student_invalid";
// import HCJBulkImport from "@/app/models/hcj_bulk_imports";
// import { dbConnect } from "@/app/utils/dbConnect";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import { parse } from "csv-parse/sync";
// import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
// import { generateCSVBuffer } from "@/app/utils/csvHelper";
// import { Readable } from 'stream';

// /**
//  * @swagger
//  * /api/institution/v1/hcjBrBT60561StudentBulkUpload:
//  *   post:
//  *     summary: Bulk import students
//  *     description: |
//  *       - Uploads a CSV file containing student details.
//  *       - Validates required fields and formats.
//  *       - Converts gender values to numeric codes.
//  *       - Checks for duplicate email records before insertion.
//  *       - Sends registration emails to valid students.
//  *       - Stores invalid records separately for review.
//  *     tags: [Student Bulk Import]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *                 description: "CSV file containing student details."
//  *     responses:
//  *       200:
//  *         description: Successfully processed the student bulk import.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Bulk import completed"
//  *                 validCount:
//  *                   type: integer
//  *                   example: 100
//  *                   description: "Number of successfully processed student records."
//  *                 invalidCount:
//  *                   type: integer
//  *                   example: 5
//  *                   description: "Number of invalid student records."
//  *                 duplicateCount:
//  *                   type: integer
//  *                   example: 10
//  *                   description: "Number of duplicate student records found."
//  *       400:
//  *         description: Bad request (e.g., no file uploaded, invalid CSV format).
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "No file uploaded"
//  *       500:
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "Failed to process bulk import"
//  */

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   pool: true,
//   maxConnections: 5,
//   maxMessages: 100,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Gender Mapping
// const genderMap = {
//   Male: "01",
//   Female: "02",
//   Other: "03",
//   "01": "01",
//   "02": "02",
//   "03": "03",
// };

// // Default values for hardcoded fields
// const DEFAULT_VALUES = {
//   HCJ_ST_Student_Country: "India",
//   HCJ_ST_Student_Document_Domicile: "India",
// };

// // Batch processing configuration
// const BATCH_CONFIG = {
//   DB_BATCH_SIZE: 100, // Number of records to insert at once
//   EMAIL_BATCH_SIZE: 20, // Number of emails to send at once
//   EMAIL_BATCH_DELAY: 2000, // Delay between email batches in ms
// };

// async function processRecordsInBatches(records, processFn, batchSize) {
//   const results = [];
//   for (let i = 0; i < records.length; i += batchSize) {
//     const batch = records.slice(i, i + batchSize);
//     const batchResults = await Promise.all(batch.map(processFn));
//     results.push(...batchResults);
//   }
//   return results;
// }

// async function sendEmailsInChunks(emailPromises, batchSize = BATCH_CONFIG.EMAIL_BATCH_SIZE, delay = BATCH_CONFIG.EMAIL_BATCH_DELAY) {
//   for (let i = 0; i < emailPromises.length; i += batchSize) {
//     const batch = emailPromises.slice(i, i + batchSize);
//     console.log(`📧 Sending batch ${i + 1}-${i + batchSize} of ${emailPromises.length} emails...`);
//     await Promise.allSettled(batch);
//     if (i + batchSize < emailPromises.length) {
//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }
//   }
// }

// async function sendRegistrationEmail(student, signupToken) {
//   const userLang = "en";
//   const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${signupToken}`;
//   const mobileDeepLink = `hcj://register?token=${signupToken}`;

//   const mailOptions = {
//     from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
//     to: student.HCJ_ST_Educational_Email,
//     subject: "Complete Your Registration - Honour Career Junction",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2>Welcome to Honour Career Junction!</h2>
//         <p>Dear ${student.HCJ_ST_Student_First_Name},</p>
//         <p>You've been invited to join Honour Career Junction by ${student.HCJ_ST_Institution_Name}.</p>
//         <p>Please click the button below to complete your registration:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${signupUrl}"
//              onclick="window.location.href='${mobileDeepLink}'; return false;"
//              style="
//               background-color: #007bff;
//               color: white;
//               padding: 12px 24px;
//               text-decoration: none;
//               border-radius: 4px;
//               display: inline-block;
//             ">
//             Complete Registration
//           </a>
//         </div>
//         <p>This link will expire in 7 days.</p>
//         <p>If you didn't request this invitation, please ignore this email.</p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { success: true, email: student.HCJ_ST_Educational_Email };
//   } catch (error) {
//     console.error(`Failed to send email to ${student.HCJ_ST_Educational_Email}:`, error);
//     return { success: false, email: student.HCJ_ST_Educational_Email, error: error.message };
//   }
// }

// async function validateStudentRecord(record, institutionNum, institutionName) {
//   const errors = [];
//   const validatedRecord = { ...record };

//   // Apply default values
//   validatedRecord.HCJ_ST_Student_Country = validatedRecord.HCJ_ST_Student_Country || DEFAULT_VALUES.HCJ_ST_Student_Country;
//   validatedRecord.HCJ_ST_Student_Document_Domicile = validatedRecord.HCJ_ST_Student_Document_Domicile || DEFAULT_VALUES.HCJ_ST_Student_Document_Domicile;

//   // Set institution info from form data
//   validatedRecord.HCJ_ST_InstituteNum = institutionNum;
//   validatedRecord.HCJ_ST_Institution_Name = institutionName;

//   // Validate required fields
//   const requiredFields = [
//     "HCJ_ST_InstituteNum",
//     "HCJ_ST_Institution_Name",
//     "HCJ_ST_Student_First_Name",
//     "HCJ_ST_Student_Last_Name",
//     "HCJ_ST_Educational_Email",
//     "HCJ_ST_Phone_Number",
//     "HCJ_ST_Gender",
//     "HCJ_ST_DOB",
//     "HCJ_ST_Student_Country",
//     "HCJ_ST_Student_Pincode",
//     "HCJ_ST_Student_State",
//     "HCJ_ST_Student_City",
//     "HCJ_ST_Address",
//     "HCJ_ST_Enrollment_Year",
//     "HCJ_ST_Student_Program_Name",
//     "HCJ_ST_Class_Of_Year",
//     "HCJ_ST_Student_Branch_Specialization",
//   ];

//   requiredFields.forEach((field) => {
//     if (!validatedRecord[field] || validatedRecord[field].toString().trim() === "") {
//       errors.push(`${field} is missing`);
//     }
//   });

//   // Validate email format
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(validatedRecord.HCJ_ST_Educational_Email)) {
//     errors.push("Invalid email format");
//   }

//   // Validate phone number (basic validation for Indian numbers)
//   const phoneRegex = /^[0-9]{10}$/;
//   if (!phoneRegex.test(validatedRecord.HCJ_ST_Phone_Number)) {
//     errors.push("Phone number must be 10 digits");
//   }

//   // Convert Gender to Numeric Format
//   if (validatedRecord.HCJ_ST_Gender in genderMap) {
//     validatedRecord.HCJ_ST_Gender = genderMap[validatedRecord.HCJ_ST_Gender];
//   } else {
//     errors.push(`Invalid Gender: ${validatedRecord.HCJ_ST_Gender}`);
//   }

//   // Convert DOB format
//   try {
//     const dobDate = new Date(validatedRecord.HCJ_ST_DOB);
//     if (isNaN(dobDate.getTime())) {
//       errors.push("Invalid date format for DOB");
//     } else {
//       validatedRecord.HCJ_ST_DOB = dobDate;
//     }
//   } catch (e) {
//     errors.push("Invalid date format for DOB");
//   }

//   return { record: validatedRecord, errors };
// }

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const formData = await req.formData();
//     const file = formData.get("file");
//     const institutionNum = formData.get("institutionNum");
//     const institutionName = formData.get("institutionName");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // Check if institution info is provided
//     if (!institutionNum || !institutionName) {
//       return NextResponse.json(
//         { error: "Institution information is missing" },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Parse CSV content
//     let records;
//     try {
//       records = parse(buffer.toString(), {
//         columns: true,
//         skip_empty_lines: true,
//         relax_column_count: true,
//       });
//     } catch (error) {
//       console.error("CSV Parsing Error:", error);
//       return NextResponse.json(
//         { error: "Invalid CSV format", details: error.message },
//         { status: 400 }
//       );
//     }

//     console.log(`Processing ${records.length} records...`);

//     // Upload CSV to Google Drive in the background
//     let csvUrl = '';
//     const uploadPromise = uploadToGoogleDrive(buffer, file.name, "text/csv")
//       .then(url => { csvUrl = url; })
//       .catch(err => console.error("Google Drive upload failed:", err));

//     // Create bulk import record
//     const bulkImport = await HCJBulkImport.create({
//       fileName: file.name,
//       uploadedBy: "Admin",
//       csvUrl: "pending", // Will be updated after upload
//       status: "processing",
//       totalRecords: records.length,
//     });

//     const bulkImportId = bulkImport._id;

//     // Process records in batches
//     let validStudents = [];
//     let invalidStudents = [];
//     let duplicateCount = 0;

//     for (let i = 0; i < records.length; i += BATCH_CONFIG.DB_BATCH_SIZE) {
//       const batch = records.slice(i, i + BATCH_CONFIG.DB_BATCH_SIZE);

//       const batchResults = await Promise.allSettled(
//         batch.map(record => validateStudentRecord(record, institutionNum, institutionName))
//       );

//       for (const result of batchResults) {
//         if (result.status === 'fulfilled') {
//           const { record, errors } = result.value;

//           if (errors.length > 0) {
//             invalidStudents.push({
//               ...record,
//               errors,
//               bulkImportId,
//               status: "invalid",
//               validationErrors: errors,
//             });
//             continue;
//           }

//           // Check for duplicates
//           const existingStudent = await HCJStudent.findOne({
//             HCJ_ST_Educational_Email: record.HCJ_ST_Educational_Email,
//           });

//           if (existingStudent) {
//             duplicateCount++;
//             continue;
//           }

//           // Generate signup token
//           const signupToken = jwt.sign(
//             { ...record, mobileApp: true },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//           );

//           validStudents.push({
//             ...record,
//             bulkImportId,
//             signupToken,
//             status: "valid",
//           });
//         } else {
//           invalidStudents.push({
//             row: batch[result.reason.index],
//             reason: result.reason.message,
//             bulkImportId,
//             status: "error",
//           });
//         }
//       }

//       // Insert valid students in batches
//       if (validStudents.length > 0) {
//         try {
//           await HCJStudent.insertMany(validStudents.slice(
//             validStudents.length - batchResults.filter(r =>
//               r.status === 'fulfilled' && r.value.errors.length === 0
//             ).length
//           ));
//         } catch (error) {
//           console.error("Batch insert error:", error);
//           // Move failed inserts to invalid
//           invalidStudents.push(...validStudents.slice(
//             validStudents.length - batchResults.filter(r =>
//               r.status === 'fulfilled' && r.value.errors.length === 0
//             ).length
//           ).map(record => ({
//             ...record,
//             errors: ["Database insertion failed"],
//             bulkImportId,
//             status: "error",
//           })));
//         }
//       }
//     }

//     // Insert invalid records
//     if (invalidStudents.length > 0) {
//       await HCJStudentInvalid.insertMany(invalidStudents);
//     }

//     // Generate and upload invalid records CSV
//     let invalidCsvUrl = '';
//     if (invalidStudents.length > 0) {
//       const invalidCsvBuffer = generateCSVBuffer(invalidStudents);
//       invalidCsvUrl = await uploadToGoogleDrive(
//         invalidCsvBuffer,
//         `invalid_${file.name}`,
//         "text/csv"
//       ).catch(err => {
//         console.error("Failed to upload invalid records CSV:", err);
//         return "";
//       });
//     }

//     // Wait for the original CSV upload to finish
//     await uploadPromise;

//     // Prepare email sending
//     const emailPromises = validStudents.map(student =>
//       sendRegistrationEmail(student, student.signupToken)
//     );

//     // Send emails in background
//     sendEmailsInChunks(emailPromises)
//       .then(() => console.log("Email sending completed"))
//       .catch(err => console.error("Email sending error:", err));

//     // Update bulk import record
//     await HCJBulkImport.findByIdAndUpdate(bulkImportId, {
//       csvUrl,
//       invalidCsvUrl,
//       validCount: validStudents.length,
//       invalidCount: invalidStudents.length,
//       duplicateCount,
//       status: "completed",
//       completedAt: new Date(),
//     });

//     return NextResponse.json({
//       message: "Bulk import completed",
//       validCount: validStudents.length,
//       invalidCount: invalidStudents.length,
//       duplicateCount,
//       bulkImportId,
//     });
//   } catch (error) {
//     console.error("Bulk Import Error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to process bulk import",
//         details: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

import HCJBulkImport from "@/app/models/hcj_bulk_imports";
import HCJStudent from "@/app/models/hcj_student";
import HCJStudentInvalid from "@/app/models/hcj_student_invalid";
import { generateCSVBuffer } from "@/app/utils/csvHelper";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import { getTranslator } from "@/i18n/server";
import { parse } from "csv-parse/sync";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Gender Mapping
const genderMap = {
  Male: "01",
  Female: "02",
  Other: "03",
  "01": "01",
  "02": "02",
  "03": "03",
};

// // CSV Header Mapping (Best Practice - camelCase keys)
// const CSV_HEADER_MAPPING = {
//   firstName: 'HCJ_ST_Student_First_Name',
//   lastName: 'HCJ_ST_Student_Last_Name',
//   email: 'HCJ_ST_Educational_Email',
//   phoneNumber: 'HCJ_ST_Phone_Number',
//   gender: 'HCJ_ST_Gender',
//   dateOfBirth: 'HCJ_ST_DOB',
//   pincode: 'HCJ_ST_Student_Pincode',
//   state: 'HCJ_ST_Student_State',
//   city: 'HCJ_ST_Student_City',
//   address: 'HCJ_ST_Address',
//   enrollmentYear: 'HCJ_ST_Enrollment_Year',
//   programName: 'HCJ_ST_Student_Program_Name',
//   gradeType: 'HCJ_ST_Score_Grade_Type',
//   grade: 'HCJ_ST_Score_Grade',
//   documentType: 'HCJ_ST_Student_Document_Type',
//   documentNumber: 'HCJ_ST_Student_Document_Number',
//   classOfYear: 'HCJ_ST_Class_Of_Year',
//   branchSpecialization: 'HCJ_ST_Student_Branch_Specialization'
// };

// // Display names for user-facing templates
// const CSV_HEADER_DISPLAY_NAMES = {
//   firstName: 'First Name',
//   lastName: 'Last Name',
//   email: 'Email',
//   phoneNumber: 'Phone Number',
//   gender: 'Gender',
//   dateOfBirth: 'Date of Birth',
//   pincode: 'Pincode',
//   state: 'State',
//   city: 'City',
//   address: 'Address',
//   enrollmentYear: 'Enrollment Year',
//   programName: 'Program Name',
//   gradeType: 'Grade Type',
//   grade: 'Grade',
//   documentType: 'Document Type',
//   documentNumber: 'Document Number',
//   classOfYear: 'Class Of Year',
//   branchSpecialization: 'Branch/Specialization'
// };

//  CSV Header Mapping (Best Practice - camelCase keys)
const CSV_HEADER_MAPPING = {
  firstName: "HCJ_ST_Student_First_Name",
  lastName: "HCJ_ST_Student_Last_Name",
  email: "HCJ_ST_Educational_Email",
  phoneNumber: "HCJ_ST_Phone_Number",
  gender: "HCJ_ST_Gender",
  dateOfBirth: "HCJ_ST_DOB",
  pincode: "HCJ_ST_Student_Pincode",
  state: "HCJ_ST_Student_State",
  city: "HCJ_ST_Student_City",
  address: "HCJ_ST_Address",
  enrollmentYear: "HCJ_ST_Enrollment_Year",
  programName: "HCJ_ST_Student_Program_Name",
  gradeType: "HCJ_ST_Score_Grade_Type",
  grade: "HCJ_ST_Score_Grade",
  documentType: "HCJ_ST_Student_Document_Type",
  documentNumber: "HCJ_ST_Student_Document_Number",
  classOfYear: "HCJ_ST_Class_Of_Year",
  branchSpecialization: "HCJ_ST_Student_Branch_Specialization",
  educationalAlternateEmail: "HCJ_ST_Educational_Alternate_Email",
  alternatePhoneNumber: "HCJ_ST_Alternate_Phone_Number",
  documentsImage: "HCJ_Student_Documents_Image",
};

// Display names for user-facing templates
const CSV_HEADER_DISPLAY_NAMES = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phoneNumber: "Phone Number",
  gender: "Gender",
  dateOfBirth: "Date of Birth",
  pincode: "Pincode",
  state: "State",
  city: "City",
  address: "Address",
  enrollmentYear: "Enrollment Year",
  programName: "Program Name",
  gradeType: "Grade Type",
  grade: "Grade",
  documentType: "Document Type",
  documentNumber: "Document Number",
  classOfYear: "Class Of Year",
  branchSpecialization: "Branch/Specialization",
  educationalAlternateEmail: "Alternate Email",
  alternatePhoneNumber: "Alternate Phone",
  documentsImage: "Documents Image",
};

// Default values for hardcoded fields
const DEFAULT_VALUES = {
  HCJ_ST_Student_Country: "India",
  HCJ_ST_Student_Document_Domicile: "India",
};

// Batch processing configuration
const BATCH_CONFIG = {
  DB_BATCH_SIZE: 100,
  EMAIL_BATCH_SIZE: 20,
  EMAIL_BATCH_DELAY: 2000,
};

async function processRecordsInBatches(records, processFn, batchSize) {
  const results = [];
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processFn));
    results.push(...batchResults);
  }
  return results;
}

async function sendEmailsInChunks(
  emailPromises,
  batchSize = BATCH_CONFIG.EMAIL_BATCH_SIZE,
  delay = BATCH_CONFIG.EMAIL_BATCH_DELAY
) {
  for (let i = 0; i < emailPromises.length; i += batchSize) {
    const batch = emailPromises.slice(i, i + batchSize);
    await Promise.allSettled(batch);
    if (i + batchSize < emailPromises.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function sendRegistrationEmail(student, signupToken) {
  const userLang = "en";
  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${signupToken}`;
  const mobileDeepLink = `hcj://register?token=${signupToken}`;

  const mailOptions = {
    from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
    to: student.HCJ_ST_Educational_Email,
    subject: "Complete Your Registration - Honour Career Junction",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Honour Career Junction!</h2>
        <p>Dear ${student.HCJ_ST_Student_First_Name},</p>
        <p>Please click the button below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${signupUrl}"
             onclick="window.location.href='${mobileDeepLink}'; return false;"
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Registration
          </a>
        </div>
        <p>This link will expire in 7 days.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, email: student.HCJ_ST_Educational_Email };
  } catch (error) {
    console.error(
      `Failed to send email to ${student.HCJ_ST_Educational_Email}:`,
      error
    );
    return {
      success: false,
      email: student.HCJ_ST_Educational_Email,
      error: error.message,
    };
  }
}

async function validateStudentRecord(record, institutionNum, institutionName) {
  const errors = [];
  const validatedRecord = { ...record };

  // Apply default values
  validatedRecord.HCJ_ST_Student_Country =
    validatedRecord.HCJ_ST_Student_Country ||
    DEFAULT_VALUES.HCJ_ST_Student_Country;
  validatedRecord.HCJ_ST_Student_Document_Domicile =
    validatedRecord.HCJ_ST_Student_Document_Domicile ||
    DEFAULT_VALUES.HCJ_ST_Student_Document_Domicile;
  validatedRecord.HCJ_ST_Score_Grade_Type =
    record.HCJ_ST_Score_Grade_Type || "N/A";
  validatedRecord.HCJ_ST_Score_Grade = record.HCJ_ST_Score_Grade || "N/A";
  validatedRecord.HCJ_ST_Student_Document_Type =
    record.HCJ_ST_Student_Document_Type || "N/A";
  validatedRecord.HCJ_ST_Student_Document_Number =
    record.HCJ_ST_Student_Document_Number || "N/A";
  validatedRecord.HCJ_ST_Educational_Alternate_Email =
    record.HCJ_ST_Educational_Alternate_Email || "N/A";
  validatedRecord.HCJ_ST_Alternate_Phone_Number =
    record.HCJ_ST_Alternate_Phone_Number || "N/A";
  validatedRecord.HCJ_Student_Documents_Image =
    record.HCJ_Student_Documents_Image || "N/A";

  // Set institution info
  validatedRecord.HCJ_ST_InstituteNum = institutionNum;
  validatedRecord.HCJ_ST_Institution_Name = institutionName;

  // Validate required fields
  const requiredFields = Object.values(CSV_HEADER_MAPPING).concat([
    "HCJ_ST_InstituteNum",
    "HCJ_ST_Institution_Name",
    "HCJ_ST_Student_Country",
    "HCJ_ST_Student_Document_Domicile",
  ]);

  requiredFields.forEach((field) => {
    if (
      !validatedRecord[field] ||
      validatedRecord[field].toString().trim() === ""
    ) {
      errors.push(`${field} is missing`);
    }
  });

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(validatedRecord.HCJ_ST_Educational_Email)) {
    errors.push("Invalid email format");
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(validatedRecord.HCJ_ST_Phone_Number)) {
    errors.push("Phone number must be 10 digits");
  }

  // Convert Gender to Numeric Format
  if (validatedRecord.HCJ_ST_Gender in genderMap) {
    validatedRecord.HCJ_ST_Gender = genderMap[validatedRecord.HCJ_ST_Gender];
  } else {
    errors.push(`Invalid Gender: ${validatedRecord.HCJ_ST_Gender}`);
  }

  // Convert DOB format
  try {
    const dobDate = new Date(validatedRecord.HCJ_ST_DOB);
    if (isNaN(dobDate.getTime())) {
      errors.push("Invalid date format for DOB");
    } else {
      validatedRecord.HCJ_ST_DOB = dobDate;
    }
  } catch (e) {
    errors.push("Invalid date format for DOB");
  }

  return { record: validatedRecord, errors };
}

export async function POST(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file");
    const institutionNum = formData.get("institutionNum");
    const institutionName = formData.get("institutionName");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          code: "6056_6",
          title: t(`errorCode.6056_6.title`),
          message: t(`errorCode.6056_6.description`),
        },
        { status: 400 }
      );
    }

    if (!institutionNum || !institutionName) {
      return NextResponse.json(
        {
          success: false,
          code: "6056_7",
          title: t(`errorCode.6056_7.title`),
          message: t(`errorCode.6056_7.description`),
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse CSV content with header mapping
    let records;
    try {
      records = parse(buffer.toString(), {
        columns: (headers) =>
          headers.map((header) => {
            const displayEntry = Object.entries(CSV_HEADER_DISPLAY_NAMES).find(
              ([_, displayName]) => displayName === header.trim()
            );
            return displayEntry ? CSV_HEADER_MAPPING[displayEntry[0]] : header;
          }),
        skip_empty_lines: true,
        relax_column_count: true,
      });
    } catch (error) {
      console.error("CSV Parsing Error:", error);
      return NextResponse.json(
        {
          success: false,
          code: "6056_8",
          title: t(`errorCode.6056_8.title`),
          message: t(`errorCode.6056_8.description`),
          error: t(`errorCode.6056_8.description`),
          details: error.message,
        },
        { status: 400 }
      );
    }

    // Upload CSV to Google Drive
    let csvUrl = "";
    const uploadPromise = uploadToGoogleDrive(buffer, file.name, "text/csv")
      .then((url) => {
        csvUrl = url;
      })
      .catch((err) => console.error("Google Drive upload failed:", err));

    // Create bulk import record
    const bulkImport = await HCJBulkImport.create({
      fileName: file.name,
      uploadedBy: "Admin",
      csvUrl: "pending",
      status: "processing",
      totalRecords: records.length,
    });

    const bulkImportId = bulkImport._id;

    // Process records
    let validStudents = [];
    let invalidStudents = [];
    let duplicateCount = 0;

    for (let i = 0; i < records.length; i += BATCH_CONFIG.DB_BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_CONFIG.DB_BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map((record) =>
          validateStudentRecord(record, institutionNum, institutionName)
        )
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          const { record, errors } = result.value;

          if (errors.length > 0) {
            invalidStudents.push({
              ...record,
              errors,
              bulkImportId,
              status: "invalid",
            });
            continue;
          }

          const existingStudent = await HCJStudent.findOne({
            HCJ_ST_Educational_Email: record.HCJ_ST_Educational_Email,
          });

          if (existingStudent) {
            duplicateCount++;
            continue;
          }

          // const signupToken = jwt.sign(
          //   { ...record, mobileApp: true },
          //   process.env.JWT_SECRET,
          //   { expiresIn: "7d" }
          // );

          // validStudents.push({
          //   ...record,
          //   bulkImportId,
          //   signupToken,
          //   status: "valid",
          // });
          try {
            // Step 1: Create student first to get the _id
            const createdStudent = await HCJStudent.create({
              ...record,
              bulkImportId,
              status: "valid", // Add status field
            });

            // Step 2: Generate token with _id
            // const signupToken = jwt.sign(
            //   {
            //     id: createdStudent._id,
            //     mobileApp: true,
            //   },
            //   process.env.JWT_SECRET,
            //   { expiresIn: "7d" }
            // );

            const signupToken = jwt.sign(
              {
                id: createdStudent._id,
                bulkImportId: createdStudent.bulkImportId,
                HCJ_ST_Individual_Id: createdStudent.HCJ_ST_Individual_Id,
                HCJ_ST_InstituteNum: createdStudent.HCJ_ST_InstituteNum,
                HCJ_ST_Institution_Name: createdStudent.HCJ_ST_Institution_Name,
                HCJ_ST_Student_Country: createdStudent.HCJ_ST_Student_Country,
                HCJ_ST_Student_Pincode: createdStudent.HCJ_ST_Student_Pincode,
                HCJ_ST_Student_State: createdStudent.HCJ_ST_Student_State,
                HCJ_ST_Student_City: createdStudent.HCJ_ST_Student_City,
                HCJ_ST_Address: createdStudent.HCJ_ST_Address,
                HCJ_ST_Student_Document_Domicile:
                  createdStudent.HCJ_ST_Student_Document_Domicile,
                HCJ_ST_Student_Document_Type:
                  createdStudent.HCJ_ST_Student_Document_Type,
                HCJ_ST_Student_Document_Number:
                  createdStudent.HCJ_ST_Student_Document_Number,
                HCJ_Student_Documents_Image:
                  createdStudent.HCJ_Student_Documents_Image,
                HCJ_ST_Student_First_Name:
                  createdStudent.HCJ_ST_Student_First_Name,
                HCJ_ST_Student_Last_Name:
                  createdStudent.HCJ_ST_Student_Last_Name,
                HCJ_ST_Educational_Email:
                  createdStudent.HCJ_ST_Educational_Email,
                HCJ_ST_Educational_Alternate_Email:
                  createdStudent.HCJ_ST_Educational_Alternate_Email,
                HCJ_ST_Phone_Number: createdStudent.HCJ_ST_Phone_Number,
                HCJ_ST_Alternate_Phone_Number:
                  createdStudent.HCJ_ST_Alternate_Phone_Number,
                HCJ_ST_Student_Branch_Specialization:
                  createdStudent.HCJ_ST_Student_Branch_Specialization,
                HCJ_ST_Student_Program_Name:
                  createdStudent.HCJ_ST_Student_Program_Name,
                HCJ_ST_Enrollment_Year: createdStudent.HCJ_ST_Enrollment_Year,
                HCJ_ST_Score_Grade_Type: createdStudent.HCJ_ST_Score_Grade_Type,
                HCJ_ST_Score_Grade: createdStudent.HCJ_ST_Score_Grade,
                HCJ_ST_DOB: createdStudent.HCJ_ST_DOB,
                HCJ_ST_Gender: createdStudent.HCJ_ST_Gender,
                HCJ_ST_Class_Of_Year: createdStudent.HCJ_ST_Class_Of_Year,
                HCJ_ST_Seeking_Internship:
                  createdStudent.HCJ_ST_Seeking_Internship,
                mobileApp: true,
              },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );

            // Step 3: Save the token to student record
            createdStudent.signupToken = signupToken;
            await createdStudent.save();

            // Step 4: Track this student for email sending
            validStudents.push(createdStudent);
          } catch (err) {
            console.error("Error inserting student or generating token:", err);
            invalidStudents.push({
              ...record,
              errors: ["Database insertion or token generation failed"],
              bulkImportId,
              status: "error",
            });
          }
        } else {
          invalidStudents.push({
            row: batch[result.reason.index],
            reason: result.reason.message,
            bulkImportId,
            status: "error",
          });
        }
      }

      // if (validStudents.length > 0) {
      //   try {
      //     await HCJStudent.insertMany(validStudents.slice(
      //       validStudents.length - batchResults.filter(r =>
      //         r.status === 'fulfilled' && r.value.errors.length === 0
      //       ).length
      //     ));
      //   } catch (error) {
      //     console.error("Batch insert error:", error);
      //     invalidStudents.push(...validStudents.slice(
      //       validStudents.length - batchResults.filter(r =>
      //         r.status === 'fulfilled' && r.value.errors.length === 0
      //       ).length
      //     ).map(record => ({
      //       ...record,
      //       errors: ["Database insertion failed"],
      //       bulkImportId,
      //       status: "error",
      //     })));
      //   }
      // }
    }

    if (invalidStudents.length > 0) {
      await HCJStudentInvalid.insertMany(invalidStudents);
    }

    let invalidCsvUrl = "";
    if (invalidStudents.length > 0) {
      const invalidCsvBuffer = generateCSVBuffer(invalidStudents);
      invalidCsvUrl = await uploadToGoogleDrive(
        invalidCsvBuffer,
        `invalid_${file.name}`,
        "text/csv"
      ).catch((err) => {
        console.error("Failed to upload invalid records CSV:", err);
        return "";
      });
    }

    await uploadPromise;

    const emailPromises = validStudents.map((student) =>
      sendRegistrationEmail(student, student.signupToken)
    );

    sendEmailsInChunks(emailPromises)
      .then(() => console.log("Email sending completed"))
      .catch((err) => console.error("Email sending error:", err));

    await HCJBulkImport.findByIdAndUpdate(bulkImportId, {
      csvUrl,
      invalidCsvUrl,
      validCount: validStudents.length,
      invalidCount: invalidStudents.length,
      duplicateCount,
      status: "completed",
      completedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        code: "6056_10",
        title: t(`errorCode.6056_10.title`),
        message: t(`errorCode.6056_10.description`),
        validCount: validStudents.length,
        invalidCount: invalidStudents.length,
        duplicateCount,
        bulkImportId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6056_9",
        title: t(`errorCode.6056_9.title`),
        message: t(`errorCode.6056_9.description`),
        error: t(`errorCode.6056_9.description`),
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    const headers = Object.values(CSV_HEADER_DISPLAY_NAMES).join(",");
    const exampleRow = [
      "John", // First Name
      "Doe", // Last Name
      "john@edu.in", // Email
      "9876543210", // Phone Number
      "Male", // Gender
      "01/01/2000", // Date of Birth (DD/MM/YYYY or ISO)
      "500001", // Pincode
      "Telangana", // State
      "Hyderabad", // City
      "123 Main St", // Address
      "2023", // Enrollment Year
      "B.Tech", // Program Name
      "Percentage", // Grade Type (optional)
      "85%", // Grade (optional)
      "Aadhar Card", // Document Type (optional)
      "1234-5678-9012", // Document Number (optional)
      "2027", // Class Of Year
      "CSE", // Branch/Specialization
      "john.alt@edu.in", // Alternate Email (optional)
      "9876543211", // Alternate Phone (optional)
      "https://drive.google.com/photo.jpg", // Documents Image URL (optional)
    ].join(",");

    const csvContent = `${headers}\n${exampleRow}`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="student_import_template.csv"',
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6056_11",
        title: t(`errorCode.6056_11.title`),
        message: t(`errorCode.6056_11.description`),
        error: t(`errorCode.6056_11.description`),
      },
      { status: 500 }
    );
  }
}
