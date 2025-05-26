import CompanyContactPerson from "@/app/models/company_contact_person";
import { dbConnect } from "@/app/utils/dbConnect";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/employee/v1/add-staff:
 *   post:
 *     summary: Add a single Team Member/Staff
 *     description: Adds a new team member or staff by collecting details and sending an invitation email
 *     tags: [Team Member/Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CCP_Admin_Invitee_Id:
 *                 type: string
 *                 example: "65fa33bb44a98b002b7d72f0"
 *               CCP_Institute_Num:
 *                 type: string
 *                 example: "INST123"
 *               CCP_Institute_Name:
 *                 type: string
 *                 example: "XYZ University"
 *               CCP_Contact_Person_First_Name:
 *                 type: string
 *                 example: "John"
 *               CCP_Contact_Person_Last_Name:
 *                 type: string
 *                 example: "Doe"
 *               CCP_Contact_Person_Phone:
 *                 type: string
 *                 example: "+919876543210"
 *               CCP_Contact_Person_Alternate_Phone:
 *                 type: string
 *                 example: "+911234567890"
 *               CCP_Contact_Person_Email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               CCP_Contact_Person_Alternate_Email:
 *                 type: string
 *                 example: "johndoe.alt@example.com"
 *               CCP_Contact_Person_Role:
 *                 type: string
 *                 example: "Professor"
 *               CCP_Contact_Person_Gender:
 *                 type: string
 *                 enum: ["Male", "Female", "Other"]
 *                 example: "Male"
 *               CCP_Contact_Person_DOB:
 *                 type: string
 *                 format: date
 *                 example: "1985-05-10"
 *               CCP_Contact_Person_Country:
 *                 type: string
 *                 example: "India"
 *               CCP_Contact_Person_Pincode:
 *                 type: string
 *                 example: "110001"
 *               CCP_Contact_Person_State:
 *                 type: string
 *                 example: "Delhi"
 *               CCP_Contact_Person_City:
 *                 type: string
 *                 example: "New Delhi"
 *               CCP_Contact_Person_Address_Line1:
 *                 type: string
 *                 example: "123 Street Name"
 *               CCP_Contact_Person_Joining_Year:
 *                 type: number
 *                 example: 2020
 *               CCP_Contact_Person_Department:
 *                 type: string
 *                 example: "Computer Science"
 *               CCP_Contact_Person_Designation:
 *                 type: string
 *                 example: "Assistant Professor"
 *               CCP_Contact_Person_Document_Domicile:
 *                 type: string
 *                 example: "India"
 *               CCP_Contact_Person_Document_Type:
 *                 type: string
 *                 example: "Aadhar Card"
 *               CCP_Contact_Person_Document_Number:
 *                 type: string
 *                 example: "1234-5678-9012"
 *               CCP_Contact_Person_Document_Picture:
 *                 type: string
 *                 format: uri
 *                 example: "https://drive.google.com/document-url"
 *               CCP_Company_Id:
 *                 type: string
 *                 example: "65fa33bb44a98b002b7d72f1"
 *               CCP_Individual_Id:
 *                 type: string
 *                 example: "65fa33bb44a98b002b7d72f2"
 *               language:
 *                 type: string
 *                 example: "en"
 *     responses:
 *       200:
 *         description: Team member added successfully, invitation sent
 *       400:
 *         description: User already exists or validation error
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const userLang = data.language || "en";

    // Check required fields
    const requiredFields = [
      "CCP_Contact_Person_First_Name",
      "CCP_Contact_Person_Last_Name",
      "CCP_Contact_Person_Phone",
      "CCP_Contact_Person_Email",
      "CCP_Contact_Person_Role",
      "CCP_Contact_Person_Gender",
      "CCP_Contact_Person_DOB",
      "CCP_Contact_Person_Country",
      "CCP_Contact_Person_Pincode",
      "CCP_Contact_Person_State",
      "CCP_Contact_Person_City",
      "CCP_Contact_Person_Address_Line1",
      "CCP_Company_Id",
      "CCP_Institute_Num",
      "CCP_Institute_Name"
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Convert DOB to Date format
    const formattedDOB = data.CCP_Contact_Person_DOB
      ? new Date(data.CCP_Contact_Person_DOB)
      : null;

    // Check if user already exists
    const existingUser = await CompanyContactPerson.findOne({
      CCP_Contact_Person_Email: data.CCP_Contact_Person_Email,
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate a unique sequential Contact Person Number
    const lastContactPerson = await CompanyContactPerson.findOne(
      {},
      { CCP_Contact_PersonNum: 1 }
    )
      .sort({ CCP_Contact_PersonNum: -1 })
      .lean();
    const nextContactPersonNum = lastContactPerson
      ? lastContactPerson.CCP_Contact_PersonNum + 1
      : 10001;

    // Save data to MongoDB
    const invite = new CompanyContactPerson({
      CCP_Admin_Invitee_Id: data.CCP_Admin_Invitee_Id,
      CCP_Institute_Num: data.CCP_Institute_Num,
      CCP_Institute_Name: data.CCP_Institute_Name,
      CCP_Contact_PersonNum: nextContactPersonNum,
      CCP_Contact_Person_First_Name: data.CCP_Contact_Person_First_Name,
      CCP_Contact_Person_Last_Name: data.CCP_Contact_Person_Last_Name,
      CCP_Contact_Person_Phone: data.CCP_Contact_Person_Phone,
      CCP_Contact_Person_Alternate_Phone: data.CCP_Contact_Person_Alternate_Phone,
      CCP_Contact_Person_Email: data.CCP_Contact_Person_Email,
      CCP_Contact_Person_Alternate_Email: data.CCP_Contact_Person_Alternate_Email,
      CCP_Contact_Person_Role: data.CCP_Contact_Person_Role,
      CCP_Contact_Person_Gender: data.CCP_Contact_Person_Gender,
      CCP_Contact_Person_DOB: formattedDOB,
      CCP_Contact_Person_Country: data.CCP_Contact_Person_Country,
      CCP_Contact_Person_Pincode: data.CCP_Contact_Person_Pincode,
      CCP_Contact_Person_State: data.CCP_Contact_Person_State,
      CCP_Contact_Person_City: data.CCP_Contact_Person_City,
      CCP_Contact_Person_Address_Line1: data.CCP_Contact_Person_Address_Line1,
      CCP_Contact_Person_Joining_Year: data.CCP_Contact_Person_Joining_Year,
      CCP_Contact_Person_Department: data.CCP_Contact_Person_Department,
      CCP_Contact_Person_Designation: data.CCP_Contact_Person_Designation,
      CCP_Contact_Person_Document_Domicile: data.CCP_Contact_Person_Document_Domicile || "N/A",
      CCP_Contact_Person_Document_Type: data.CCP_Contact_Person_Document_Type || "N/A",
      CCP_Contact_Person_Document_Number: data.CCP_Contact_Person_Document_Number || "N/A",
      CCP_Contact_Person_Document_Picture: data.CCP_Contact_Person_Document_Picture || "",
      CCP_Company_Id: data.CCP_Company_Id,
      CCP_Individual_Id: data.CCP_Individual_Id || null,
      CCP_Session_Id: Math.floor(Math.random() * 100000),
    });
    await invite.save();

    // Generate JWT token including all user data
    const token = jwt.sign(
      {
        id: invite._id,
        ...data,
        CCP_Contact_PersonNum: nextContactPersonNum,
        CCP_Contact_Person_DOB: formattedDOB,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const roleMap = {
      "10": "Team Member",
      "11": "Support Staff",
    };
    const roleName =
      roleMap[data.CCP_Contact_Person_Role] || data.CCP_Contact_Person_Role;

    // Send email invitation
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const signupUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${userLang}/team-signup?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.CCP_Contact_Person_Email,
      subject: "Invitation to Join Honour Career Junction",
      html: `
        <p>Dear <b>${data.CCP_Contact_Person_First_Name} ${data.CCP_Contact_Person_Last_Name}</b>,</p>
        <p>We are inviting you to join Honour Career Junction (HCJ). Your role as a <b>${roleName}</b> will be valuable.</p>
        <p>To get started, please follow the steps below:</p>
        <ol>
          <li>Click on the invitation link: <a href="${signupUrl}">here</a></li>
          <li>Use your institutional email ID to sign up.</li>
          <li>Complete your profile setup.</li>
        </ol>
        <p>Best regards,<br/>${data.CCP_Institute_Name}</p>
      `,
    });

    return NextResponse.json(
      { message: "Invitation sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in staff registration API:", error);
    return NextResponse.json(
      {
        error: "Failed to register staff",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}