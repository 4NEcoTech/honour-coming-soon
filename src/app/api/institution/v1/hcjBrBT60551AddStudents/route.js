import { getTranslator } from "@/i18n/server";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Student from "../../../../models/hcj_student";
import { generateAuditTrail } from "../../../../utils/audit-trail";
import { dbConnect } from "../../../../utils/dbConnect";

/**
 * @swagger
 * /institution/v1/hcjBrBT60551AddStudents:
 *   post:
 *     summary: Register a new student
 *     description: Registers a student and sends a verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HCJ_ST_InstituteNum:
 *                 type: string
 *                 example: "12345"
 *               HCJ_ST_Institution_Name:
 *                 type: string
 *                 example: "XYZ University"
 *               HCJ_ST_Student_First_Name:
 *                 type: string
 *                 example: "John"
 *               HCJ_ST_Student_Last_Name:
 *                 type: string
 *                 example: "Doe"
 *               HCJ_ST_Educational_Email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               HCJ_ST_Phone_Number:
 *                 type: string
 *                 example: "+919876543210"
 *               HCJ_ST_Gender:
 *                 type: string
 *                 enum: ["Male", "Female", "Other"]
 *               HCJ_ST_DOB:
 *                 type: string
 *                 format: date
 *                 example: "2000-05-15"
 *               HCJ_ST_Student_Country:
 *                 type: string
 *                 example: "India"
 *               HCJ_ST_Student_Pincode:
 *                 type: string
 *                 example: "123456"
 *               HCJ_ST_Student_State:
 *                 type: string
 *                 example: "Maharashtra"
 *               HCJ_ST_Student_City:
 *                 type: string
 *                 example: "Mumbai"
 *               HCJ_ST_Address:
 *                 type: string
 *                 example: "123 Main Street"
 *               HCJ_ST_Enrollment_Year:
 *                 type: string
 *                 example: "2023"
 *               HCJ_ST_Student_Program_Name:
 *                 type: string
 *                 example: "Computer Science"
 *               HCJ_ST_Class_Of_Year:
 *                 type: string
 *                 example: "2027"
 *               HCJ_ST_Student_Branch_Specialization:
 *                 type: string
 *                 example: "Artificial Intelligence"
 *               HCJ_ST_Score_Grade_Type:
 *                 type: string
 *                 example: "Percentage"
 *               HCJ_ST_Score_Grade:
 *                 type: string
 *                 example: "85%"
 *               HCJ_ST_Student_Document_Domicile:
 *                 type: string
 *                 example: "Residence Proof"
 *               HCJ_ST_Student_Document_Type:
 *                 type: string
 *                 example: "Aadhar Card"
 *               HCJ_ST_Student_Document_Number:
 *                 type: string
 *                 example: "1234-5678-9012"
 *               HCJ_ST_Educational_Alternate_Email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe.alternate@example.com"
 *               HCJ_ST_Alternate_Phone_Number:
 *                 type: string
 *                 example: "+919876543211"
 *               HCJ_Student_Documents_Image:
 *                 type: string
 *                 format: uri
 *                 example: "https://drive.google.com/photo-url"
 *               language:
 *                 type: string
 *                 example: "en"
 *     responses:
 *       201:
 *         description: Student added successfully
 *       400:
 *         description: Missing required fields or validation error
 *       500:
 *         description: Server error
 */
export async function POST(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    await dbConnect();

    const data = await req.json();
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
      "HCJ_ST_Address",
      "HCJ_ST_Enrollment_Year",
      "HCJ_ST_Student_Program_Name",
      "HCJ_ST_Class_Of_Year",
      "HCJ_ST_Student_Branch_Specialization",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          {
            success: false,
            code: "6055_36",
            title: t("errorCode.6055_36.title"),
            message: t("errorCode.6055_36.description", { field }),
          },
          { status: 400 }
        );
      }
    }

    if (!isNaN(Date.parse(data.HCJ_ST_DOB))) {
      data.HCJ_ST_DOB = new Date(data.HCJ_ST_DOB);
    } else {
      return NextResponse.json(
        {
          success: false,
          code: "6055_37",
          title: t("errorCode.6055_37.title"),
          message: t("errorCode.6055_37.description"),
        },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({
      HCJ_ST_Educational_Email: data.HCJ_ST_Educational_Email,
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          code: "6055_38",
          title: t("errorCode.6055_38.title"),
          message: t("errorCode.6055_38.description"),
        },
        { status: 400 }
      );
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
      HCJ_ST_Address: data.HCJ_ST_Address,
      HCJ_ST_Enrollment_Year: data.HCJ_ST_Enrollment_Year,
      HCJ_ST_Student_Program_Name: data.HCJ_ST_Student_Program_Name,
      HCJ_ST_Score_Grade_Type: data.HCJ_ST_Score_Grade_Type || "N/A",
      HCJ_ST_Score_Grade: data.HCJ_ST_Score_Grade || "N/A",
      HCJ_ST_Student_Document_Domicile:
        data.HCJ_ST_Student_Document_Domicile || "N/A",
      HCJ_ST_Student_Document_Type: data.HCJ_ST_Student_Document_Type || "N/A",
      HCJ_ST_Student_Document_Number:
        data.HCJ_ST_Student_Document_Number || "N/A",
      HCJ_ST_Educational_Alternate_Email:
        data.HCJ_ST_Educational_Alternate_Email || undefined,
      HCJ_ST_Alternate_Phone_Number:
        data.HCJ_ST_Alternate_Phone_Number || undefined,
      HCJ_ST_Class_Of_Year: data.HCJ_ST_Class_Of_Year,
      HCJ_Student_Documents_Image: data.HCJ_Student_Documents_Image || "",
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
        mobileApp: true,
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

    // const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${signupToken}`;
    const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${userLang}/student-signup?token=${signupToken}`;
    const mobileDeepLink = `hcj://register?token=${signupToken}`;

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
            <li>Address: ${data.HCJ_ST_Address}</li>
            <li>Photo: ${
              data.HCJ_Student_Documents_Image || "Not uploaded"
            }</li>
          </ul>
          <p>Please review the registration in the admin dashboard.</p>
        </div>
      `,
    });

    // Update the email template to handle both web and mobile
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
        <a href="${signupUrl}"
           onclick="window.location.href='${mobileDeepLink}'; return false;"
           style="
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">
          Complete Registration
        </a>
      </div>
      <p>This link will expire in 7 days.</p>
      <p>If you didn't request this invitation, please ignore this email.</p>
    </div>
  `,
    });

    return NextResponse.json(
      {
        success: false,
        code: "6055_23",
        title: t("errorCode.6055_23.title"),
        message: t("errorCode.6055_23.description"),
        studentId: newStudent._id,
        signupToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      {
        success: false,
        code: "6055_30",
        title: t("errorCode.6055_30.title"),
        message: t("errorCode.6055_30.description"),
      },
      { status: 500 }
    );
  }
}
