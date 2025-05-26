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
 * /api/employee/v1/bulk-upload:
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

// // CSV Header Mapping (Best Practice - camelCase keys)
// const CSV_HEADER_MAPPING = {
//   firstName: 'CCP_Contact_Person_First_Name',
//   lastName: 'CCP_Contact_Person_Last_Name',
//   email: 'CCP_Contact_Person_Email',
//   alternateEmail:'CCP_Contact_Person_Alternate_Email',
//   phone: 'CCP_Contact_Person_Phone',
//   gender: 'CCP_Contact_Person_Gender',
//   dateOfBirth: 'CCP_Contact_Person_DOB',
//   role: 'CCP_Contact_Person_Role',
//   pincode: 'CCP_Contact_Person_Pincode',
//   state: 'CCP_Contact_Person_State',
//   city: 'CCP_Contact_Person_City',
//   addressLine1: 'CCP_Contact_Person_Address_Line1',
// };

// // Display names for user-facing templates
// const CSV_HEADER_DISPLAY_NAMES = {
//   firstName: 'First Name',
//   lastName: 'Last Name',
//   email: 'Email',
//   alternateEmail : 'Alternate Email',
//   phone: 'Phone Number',
//   gender: 'Gender',
//   dateOfBirth: 'Date of Birth',
//   role: 'Role',
//   pincode: 'Pincode',
//   state: 'State',
//   city: 'City',
//   addressLine1: 'Address Line 1',
// };

// CSV Header Mapping (Best Practice - camelCase keys)
const CSV_HEADER_MAPPING = {
  firstName: "CCP_Contact_Person_First_Name",
  lastName: "CCP_Contact_Person_Last_Name",
  email: "CCP_Contact_Person_Email",
  alternateEmail: "CCP_Contact_Person_Alternate_Email",
  phone: "CCP_Contact_Person_Phone",
  alternatePhone: "CCP_Contact_Person_Alternate_Phone",
  gender: "CCP_Contact_Person_Gender",
  dateOfBirth: "CCP_Contact_Person_DOB",
  role: "CCP_Contact_Person_Role",
  pincode: "CCP_Contact_Person_Pincode",
  state: "CCP_Contact_Person_State",
  city: "CCP_Contact_Person_City",
  addressLine1: "CCP_Contact_Person_Address_Line1",
  joiningYear: "CCP_Contact_Person_Joining_Year",
  department: "CCP_Contact_Person_Department",
  designation: "CCP_Contact_Person_Designation",
  documentDomicile: "CCP_Contact_Person_Document_Domicile",
  documentType: "CCP_Contact_Person_Document_Type",
  documentNumber: "CCP_Contact_Person_Document_Number",
  documentPicture: "CCP_Contact_Person_Document_Picture",
};

// Display names for user-facing templates
const CSV_HEADER_DISPLAY_NAMES = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  alternateEmail: "Alternate Email",
  phone: "Phone Number",
  alternatePhone: "Alternate Phone Number",
  gender: "Gender",
  dateOfBirth: "Date of Birth",
  role: "Role",
  pincode: "Pincode",
  state: "State",
  city: "City",
  addressLine1: "Address Line 1",
  joiningYear: "Joining Year",
  department: "Department",
  designation: "Designation",
  documentDomicile: "Document Domicile",
  documentType: "Document Type",
  documentNumber: "Document Number",
  documentPicture: "Document Picture URL",
};

// Role Mapping
const ROLE_MAPPING = {
  "Employee Team Member": "10",
  "Employee Support": "11",
  "10": "10",
  "11": "11",
};

// Gender Mapping
const GENDER_MAPPING = {
  Male: "01",
  Female: "02",
  Other: "03",
  "01": "01",
  "02": "02",
  "03": "03",
};

// Default values
const DEFAULT_VALUES = {
  CCP_Contact_Person_Country: "India",
  CCP_Contact_Person_Document_Domicile: "India",
};

// Batch processing configuration
const BATCH_CONFIG = {
  DB_BATCH_SIZE: 100,
  EMAIL_BATCH_SIZE: 20,
  EMAIL_BATCH_DELAY: 2000,
};

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

async function sendTeamRegistrationEmail(teamMember, signupToken) {
  const userLang = "en";
  const roleName = Object.keys(ROLE_MAPPING).find(
    (key) => ROLE_MAPPING[key] === teamMember.CCP_Contact_Person_Role
  );
  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/team-signup?token=${signupToken}`;
  const mobileDeepLink = `hcj://register?token=${signupToken}`;

  const mailOptions = {
    from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
    to: teamMember.CCP_Contact_Person_Email,
    subject: "Invitation to Join Honour Career Junction",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Honour Career Junction!</h2>
        <p>Dear ${teamMember.CCP_Contact_Person_First_Name},</p>
        <p>You've been invited to join Honour Career Junction as a <b>${roleName}</b>.</p>
        <p>Please click the button below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${signupUrl}" 
             onclick="window.location.href='${mobileDeepLink}'; return false;"
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Registration
          </a>
        </div>
        <p>This link will expire in 7 days.</p>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, email: teamMember.CCP_Contact_Person_Email };
  } catch (error) {
    console.error(
      `Failed to send email to ${teamMember.CCP_Contact_Person_Email}:`,
      error
    );
    return {
      success: false,
      email: teamMember.CCP_Contact_Person_Email,
      error: error.message,
    };
  }
}

async function validateTeamMemberRecord(
  record,
  institutionNum,
  institutionName,
  companyId,
  adminInviteeId
) {
  const errors = [];
  const validatedRecord = { ...record };

  // Apply default values
  validatedRecord.CCP_Contact_Person_Country =
    validatedRecord.CCP_Contact_Person_Country ||
    DEFAULT_VALUES.CCP_Contact_Person_Country;
  validatedRecord.CCP_Contact_Person_Document_Domicile =
    validatedRecord.CCP_Contact_Person_Document_Domicile ||
    DEFAULT_VALUES.CCP_Contact_Person_Document_Domicile;
  validatedRecord.CCP_Contact_Person_Alternate_Phone =
    record.CCP_Contact_Person_Alternate_Phone || "N/A";
  validatedRecord.CCP_Contact_Person_Joining_Year =
    record.CCP_Contact_Person_Joining_Year || null;
  validatedRecord.CCP_Contact_Person_Department =
    record.CCP_Contact_Person_Department || "N/A";
  validatedRecord.CCP_Contact_Person_Designation =
    record.CCP_Contact_Person_Designation || "N/A";
  validatedRecord.CCP_Contact_Person_Document_Domicile =
    record.CCP_Contact_Person_Document_Domicile || "India";
  validatedRecord.CCP_Contact_Person_Document_Type =
    record.CCP_Contact_Person_Document_Type || "N/A";
  validatedRecord.CCP_Contact_Person_Document_Number =
    record.CCP_Contact_Person_Document_Number || "N/A";
  validatedRecord.CCP_Contact_Person_Document_Picture =
    record.CCP_Contact_Person_Document_Picture || "N/A";

  // Set institution and admin info
  validatedRecord.CCP_Institute_Num = institutionNum;
  validatedRecord.CCP_Institute_Name = institutionName;
  validatedRecord.CCP_Company_Id = companyId;
  validatedRecord.CCP_Admin_Invitee_Id = adminInviteeId;

  // Validate required fields
  const requiredFields = [
    "CCP_Institute_Num",
    "CCP_Institute_Name",
    "CCP_Contact_Person_First_Name",
    "CCP_Contact_Person_Last_Name",
    "CCP_Contact_Person_Email",
    "CCP_Contact_Person_Alternate_Email",
    "CCP_Contact_Person_Phone",
    "CCP_Contact_Person_Role",
    "CCP_Contact_Person_Gender",
    "CCP_Contact_Person_DOB",
    "CCP_Contact_Person_Country",
    "CCP_Contact_Person_Pincode",
    "CCP_Contact_Person_State",
    "CCP_Contact_Person_City",
    "CCP_Contact_Person_Address_Line1",
  ];

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
  if (!emailRegex.test(validatedRecord.CCP_Contact_Person_Email)) {
    errors.push("Invalid email format");
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(validatedRecord.CCP_Contact_Person_Phone)) {
    errors.push("Phone number must be 10 digits");
  }

  // Convert Gender to Numeric Format
  if (validatedRecord.CCP_Contact_Person_Gender in GENDER_MAPPING) {
    validatedRecord.CCP_Contact_Person_Gender =
      GENDER_MAPPING[validatedRecord.CCP_Contact_Person_Gender];
  } else {
    errors.push(`Invalid Gender: ${validatedRecord.CCP_Contact_Person_Gender}`);
  }

  // Convert Role to Code
  if (validatedRecord.CCP_Contact_Person_Role in ROLE_MAPPING) {
    validatedRecord.CCP_Contact_Person_Role =
      ROLE_MAPPING[validatedRecord.CCP_Contact_Person_Role];
  } else {
    errors.push(`Invalid Role: ${validatedRecord.CCP_Contact_Person_Role}`);
  }

  // Convert DOB format
  try {
    const dobDate = new Date(validatedRecord.CCP_Contact_Person_DOB);
    if (isNaN(dobDate.getTime())) {
      errors.push("Invalid date format for DOB");
    } else {
      validatedRecord.CCP_Contact_Person_DOB = dobDate;
    }
  } catch (e) {
    errors.push("Invalid date format for DOB");
  }

  return { record: validatedRecord, errors };
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file");
    const institutionNum = formData.get("institutionNum");
    const institutionName = formData.get("institutionName");
    const companyId = formData.get("companyId");
    const adminInviteeId = formData.get("adminInviteeId");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!institutionNum || !institutionName || !companyId || !adminInviteeId) {
      return NextResponse.json(
        { error: "Required information is missing" },
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
        { error: "Invalid CSV format", details: error.message },
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
    let validTeamMembers = [];
    let invalidTeamMembers = [];
    let duplicateCount = 0;

    for (let i = 0; i < records.length; i += BATCH_CONFIG.DB_BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_CONFIG.DB_BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map((record) =>
          validateTeamMemberRecord(
            record,
            institutionNum,
            institutionName,
            companyId,
            adminInviteeId
          )
        )
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          const { record, errors } = result.value;

          if (errors.length > 0) {
            invalidTeamMembers.push({
              ...record,
              errors,
              bulkImportId,
              status: "invalid",
            });
            continue;
          }

          const existingUser = await CompanyContactPerson.findOne({
            CCP_Contact_Person_Email: record.CCP_Contact_Person_Email,
          });

          if (existingUser) {
            duplicateCount++;
            continue;
          }

          // const signupToken = jwt.sign(
          //   { ...record, mobileApp: true },
          //   process.env.JWT_SECRET,
          //   { expiresIn: "7d" }
          // );

          // validTeamMembers.push({
          //   ...record,
          //   bulkImportId,
          //   signupToken,
          //   status: "valid",
          // });
          try {
            const createdStaff = await CompanyContactPerson.create({
              ...record,
              bulkImportId,
              status: "valid",
            });

            const signupToken = jwt.sign(
              {
                id: createdStaff._id,
                CCP_Admin_Invitee_Id: createdStaff.CCP_Admin_Invitee_Id,
                CCP_Institute_Num: createdStaff.CCP_Institute_Num,
                CCP_Institute_Name: createdStaff.CCP_Institute_Name,
                CCP_Company_Id: createdStaff.CCP_Company_Id,
                CCP_Individual_Id: createdStaff.CCP_Individual_Id,
                CCP_Contact_Person_First_Name:
                  createdStaff.CCP_Contact_Person_First_Name,
                CCP_Contact_Person_Last_Name:
                  createdStaff.CCP_Contact_Person_Last_Name,
                CCP_Contact_Person_Email: createdStaff.CCP_Contact_Person_Email,
                CCP_Contact_Person_Alternate_Email:
                  createdStaff.CCP_Contact_Person_Alternate_Email,
                CCP_Contact_Person_Phone: createdStaff.CCP_Contact_Person_Phone,
                CCP_Contact_Person_Alternate_Phone:
                  createdStaff.CCP_Contact_Person_Alternate_Phone,
                CCP_Contact_Person_Gender:
                  createdStaff.CCP_Contact_Person_Gender,
                CCP_Contact_Person_DOB: createdStaff.CCP_Contact_Person_DOB,
                CCP_Contact_Person_Country:
                  createdStaff.CCP_Contact_Person_Country,
                CCP_Contact_Person_Pincode:
                  createdStaff.CCP_Contact_Person_Pincode,
                CCP_Contact_Person_State: createdStaff.CCP_Contact_Person_State,
                CCP_Contact_Person_City: createdStaff.CCP_Contact_Person_City,
                CCP_Contact_Person_Address_Line1:
                  createdStaff.CCP_Contact_Person_Address_Line1,
                CCP_Contact_Person_Joining_Year:
                  createdStaff.CCP_Contact_Person_Joining_Year,
                CCP_Contact_Person_Department:
                  createdStaff.CCP_Contact_Person_Department,
                CCP_Contact_Person_Designation:
                  createdStaff.CCP_Contact_Person_Designation,
                CCP_Contact_Person_Role: createdStaff.CCP_Contact_Person_Role,
                CCP_Contact_Person_Document_Domicile:
                  createdStaff.CCP_Contact_Person_Document_Domicile,
                CCP_Contact_Person_Document_Type:
                  createdStaff.CCP_Contact_Person_Document_Type,
                CCP_Contact_Person_Document_Number:
                  createdStaff.CCP_Contact_Person_Document_Number,
                CCP_Contact_Person_Document_Picture:
                  createdStaff.CCP_Contact_Person_Document_Picture,
                mobileApp: true,
              },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );

            createdStaff.signupToken = signupToken;
            await createdStaff.save();

            validTeamMembers.push(createdStaff);
          } catch (err) {
            console.error("Error inserting staff or generating token:", err);
            invalidTeamMembers.push({
              ...record,
              errors: ["Database insertion or token generation failed"],
              bulkImportId,
              status: "error",
            });
          }
        } else {
          invalidTeamMembers.push({
            row: batch[result.reason.index],
            reason: result.reason.message,
            bulkImportId,
            status: "error",
          });
        }
      }
    }

    if (invalidTeamMembers.length > 0) {
      await HCJStaffInvalid.insertMany(invalidTeamMembers);
    }

    let invalidCsvUrl = "";
    if (invalidTeamMembers.length > 0) {
      const invalidCsvBuffer = generateCSVBuffer(invalidTeamMembers);
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

    const emailPromises = validTeamMembers.map((teamMember) =>
      sendTeamRegistrationEmail(teamMember, teamMember.signupToken)
    );

    sendEmailsInChunks(emailPromises)
      .then(() => console.log("Email sending completed"))
      .catch((err) => console.error("Email sending error:", err));

    await HCJBulkImport.findByIdAndUpdate(bulkImportId, {
      csvUrl,
      invalidCsvUrl,
      validCount: validTeamMembers.length,
      invalidCount: invalidTeamMembers.length,
      duplicateCount,
      status: "completed",
      completedAt: new Date(),
    });

    return NextResponse.json({
      message: "Bulk import completed",
      validCount: validTeamMembers.length,
      invalidCount: invalidTeamMembers.length,
      duplicateCount,
      bulkImportId,
    });
  } catch (error) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process bulk import",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const headers = Object.values(CSV_HEADER_DISPLAY_NAMES).join(",");
    const exampleRow = [
      "John", // First Name
      "Doe", // Last Name
      "john@example.com", // Email
      "john.alt@example.com", // Alternate Email
      "9876543210", // Phone Number
      "9123456789", // Alternate Phone Number
      "Male", // Gender
      "01/01/1990", // Date of Birth
      "Institution Team Member", // Role
      "500001", // Pincode
      "Telangana", // State
      "Hyderabad", // City
      "123 Main Street", // Address Line 1
      "2020", // Joining Year
      "Computer Science", // Department
      "Assistant Professor", // Designation
      "India", // Document Domicile
      "Aadhar Card", // Document Type
      "1234-5678-9012", // Document Number
      "https://drive.google.com/photo.jpg", // Document Picture URL
    ].join(",");

    const csvContent = `${headers}\n${exampleRow}`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="staff_import_template.csv"',
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}