import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Student from "../../../../models/hcj_student";
import { generateAuditTrail } from "../../../../utils/audit-trail";
import { dbConnect } from "../../../../utils/dbConnect";
import { uploadToGoogleDrive } from "../../../../utils/googleDrive";

/**
 * @swagger
 * /institution/v1/hcjBrBT60551AddStudents:
 *   post:
 *     summary: Register a new student
 *     description: Registers a student and sends a verification email
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               institutionNumber:
 *                 type: string
 *                 example: "12345"
 *               institutionName:
 *                 type: string
 *                 example: "XYZ University"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               institutionEmail:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+919876543210"
 *               gender:
 *                 type: string
 *                 enum: ["Male", "Female", "Other"]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2000-05-15"
 *               country:
 *                 type: string
 *                 example: "India"
 *               documentDomicile:
 *                 type: string
 *                 example: "Residence Proof"
 *               documentType:
 *                 type: string
 *                 example: "Aadhar Card"
 *               documentNumber:
 *                 type: string
 *                 example: "1234-5678-9012"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Student added successfully
 *       400:
 *         description: Missing required fields or validation error
 *       500:
 *         description: Server error
 */
export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const userLang = data.language || "en";

    const requiredFields = [
      "HCJ_ST_InstituteNum",
      "HCJ_ST_Institution_Name",
      "HCJ_ST_Student_First_Name",
      "HCJ_ST_Student_Last_Name",
      "HCJ_ST_Educational_Email",
      "HCJ_ST_Phone_Number",
      "HCJ_ST_Gender",
      "HCJ_ST_DOB",
      "HCJ_ST_Student_Country",
      "HCJ_ST_Student_Pincode",
      "HCJ_ST_Student_State",
      "HCJ_ST_Student_City",
      "HCJ_ST_Address", // ✅ Added this attribute
      "HCJ_ST_Enrollment_Year",
      "HCJ_ST_Student_Program_Name",
      "HCJ_ST_Score_Grade_Type",
      "HCJ_ST_Score_Grade",
      "HCJ_ST_Student_Document_Domicile",
      "HCJ_ST_Student_Document_Type",
      "HCJ_ST_Student_Document_Number",
      "HCJ_ST_Class_Of_Year",
      "HCJ_ST_Student_Branch_Specialization",
    ];

    // console.log(data, "data")

    for (let field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (!isNaN(Date.parse(data.HCJ_ST_DOB))) {
      data.HCJ_ST_DOB = new Date(data.HCJ_ST_DOB);
    } else {
      return NextResponse.json(
        { error: "Invalid date format for HCJ_ST_DOB" },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({
      HCJ_ST_Educational_Email: data.HCJ_ST_Educational_Email,
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student with this email already exists" },
        { status: 400 }
      );
    }

    let photoUrl = "";
    const photo = formData.get("photo");
    if (photo && photo instanceof File) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const filename = `student_photo_${Date.now()}_${photo.name}`;
      photoUrl = await uploadToGoogleDrive(buffer, filename, photo.type);
    }

    const auditTrail = await generateAuditTrail(req);

    const studentData = {
      HCJ_ST_InstituteNum: data.HCJ_ST_InstituteNum,
      HCJ_ST_Institution_Name: data.HCJ_ST_Institution_Name,
      HCJ_ST_Student_First_Name: data.HCJ_ST_Student_First_Name,
      HCJ_ST_Student_Last_Name: data.HCJ_ST_Student_Last_Name,
      HCJ_ST_Educational_Email: data.HCJ_ST_Educational_Email,
      HCJ_ST_Phone_Number: data.HCJ_ST_Phone_Number,
      HCJ_ST_Gender: data.HCJ_ST_Gender,
      HCJ_ST_DOB: data.HCJ_ST_DOB,
      HCJ_ST_Student_Country: data.HCJ_ST_Student_Country,
      HCJ_ST_Student_Pincode: data.HCJ_ST_Student_Pincode,
      HCJ_ST_Student_State: data.HCJ_ST_Student_State,
      HCJ_ST_Student_City: data.HCJ_ST_Student_City,
      HCJ_ST_Address: data.HCJ_ST_Address, // ✅ Added this attribute
      HCJ_ST_Enrollment_Year: data.HCJ_ST_Enrollment_Year,
      HCJ_ST_Student_Program_Name: data.HCJ_ST_Student_Program_Name,
      HCJ_ST_Score_Grade_Type: data.HCJ_ST_Score_Grade_Type,
      HCJ_ST_Score_Grade: data.HCJ_ST_Score_Grade,
      HCJ_ST_Student_Document_Domicile: data.HCJ_ST_Student_Document_Domicile,
      HCJ_ST_Student_Document_Type: data.HCJ_ST_Student_Document_Type,
      HCJ_ST_Student_Document_Number: data.HCJ_ST_Student_Document_Number,
      HCJ_ST_Educational_Alternate_Email:
        data.HCJ_ST_Educational_Alternate_Email || undefined,
      HCJ_ST_Alternate_Phone_Number:
        data.HCJ_ST_Alternate_Phone_Number || undefined,
      HCJ_ST_Class_Of_Year: data.HCJ_ST_Class_Of_Year,
      HCJ_Student_Documents_Image: photoUrl,
      HCJ_ST_Student_Branch_Specialization:
        data.HCJ_ST_Student_Branch_Specialization,
      HCJ_ST_Audit_Trail: [auditTrail],
    };

    const newStudent = new Student(studentData);
    await newStudent.save();

    const signupToken = jwt.sign(
      {
        id: newStudent._id,
        ...data,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    newStudent.signupToken = signupToken;
    await newStudent.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${signupToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Student Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Student Registration</h2>
          <p>A new student has been registered with the following details:</p>
          <ul>
            <li>Name: ${data.HCJ_ST_Student_First_Name} ${
        data.HCJ_ST_Student_Last_Name
      }</li>
            <li>Email: ${data.HCJ_ST_Educational_Email}</li>
            <li>Institution: ${data.HCJ_ST_Institution_Name}</li>
            <li>Program: ${data.HCJ_ST_Student_Program_Name}</li>
            <li>Address: ${
              data.HCJ_ST_Address
            }</li>  // ✅ Added Address in Email
            <li>Photo: ${photoUrl || "Not uploaded"}</li>
          </ul>
          <p>Please review the registration in the admin dashboard.</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.HCJ_ST_Educational_Email,
      subject: "Complete Your Registration - Honour Career Junction",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Honour Career Junction!</h2>
          <p>Dear ${data.HCJ_ST_Student_First_Name},</p>
          <p>You've been invited to join Honour Career Junction by ${data.HCJ_ST_Institution_Name}.</p>
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

    return NextResponse.json(
      {
        message: "Student added successfully",
        studentId: newStudent._id,
        signupToken,
        photoUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      {
        error: "Failed to add student",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

