import User from "@/app/models/hcj_job_fair_form";
import { generateAuditTrail } from "@/app/utils/audit-trail";
import { dbConnect } from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/hcj/v1/hcjJBrBT60051JobFairForm:
 *   post:
 *     tags:
 *       - Job Fair Registration
 *     summary: Register a new user for the job fair.
 *     description: Endpoint to register a new user for the job fair, send confirmation emails, and store audit trail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institutionName:
 *                 type: string
 *                 example: "ABC University"
 *                 description: Name of the institution.
 *               institutionAddress:
 *                 type: string
 *                 example: "123 University Road, City, Country"
 *                 description: Address of the institution.
 *               institutionEmail:
 *                 type: string
 *                 format: email
 *                 example: "contact@abcuniversity.edu"
 *                 description: Email of the institution.
 *               institutionPhone:
 *                 type: string
 *                 example: "+1234567890"
 *                 description: Phone number of the institution.
 *               adminPhone:
 *                 type: string
 *                 example: "+0987654321"
 *                 description: Phone number of the institution admin.
 *               firstName:
 *                 type: string
 *                 example: "John"
 *                 description: First name of the user.
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *                 description: Last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *                 description: Email of the user.
 *               userPhone:
 *                 type: string
 *                 example: "+1122334455"
 *                 description: Phone number of the user.
 *     responses:
 *       200:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6005_1"
 *                   description: Success code.
 *                 title:
 *                   type: string
 *                   example: "Success"
 *                   description: Success title.
 *                 message:
 *                   type: string
 *                   example: "6005_1 Registration successful"
 *                   description: Success message.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "6006_5"
 *                   description: Error code.
 *                 title:
 *                   type: string
 *                   example: "error"
 *                   description: Error title.
 *                 message:
 *                   type: string
 *                   example: "6005_2 Internal Server Error"
 *                   description: Error message.
 */

// POST method handler
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      institutionName,
      institutionAddress,
      institutionEmail,
      institutionPhone,
      adminPhone,
      firstName,
      lastName,
      email,
      userPhone,
    } = body;

    // Connect to the database
    await dbConnect();

    // Generate audit trail data
    const auditTrail = await generateAuditTrail(req);

    // Save the user to the database
    const newUser = await User.create({
      HCJ_JFF_Institution_Name: institutionName,
      HCJ_JFF_Institution_Address: institutionAddress,
      HCJ_JFF_Institution_Email: institutionEmail,
      HCJ_JFF_Institution_Phone: institutionPhone,
      HCJ_JFF_Institution_Admin_Phone: adminPhone,
      HCJ_JFF_First_Name: firstName,
      HCJ_JFF_Last_Name: lastName,
      HCJ_JFF_Email: email,
      HCJ_JFF_User_Phone: userPhone,
      audit_trail: [auditTrail], // Include audit trail
    });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Email 1: New Job Fair Registration Alert to HCJ Admin
    const jobFairAlertMail = {
      from: process.env.EMAIL_USER,
      to: institutionEmail, // HCJ Admin Institution Email
      subject: "New Job Fair Registration Alert!",
      text: `
        Dear Admin,

        A new user has registered for the job fair. Below are the details:

        Registration Details:
        ● Name: ${firstName} ${lastName}
        ● Email: ${email}
        ● Phone Number: ${userPhone}
        ● Registration Timestamp: ${new Date().toLocaleString()}

        Feel free to contact the user directly for further engagement or support. Let’s ensure they have an excellent experience with us!

        Warm regards,
        Honour Career Junction System
      `,
    };

    // Email 2: Student Registration Request to HCJ Admin
    const studentRequestMail = {
      from: process.env.EMAIL_USER,
      to: "thehonourenterprise@gmail.com", // HCJ Admin Email
      subject: "New Student Registration Request for Institution",
      text: `
        Dear Admin,

        A student has requested their institution to register on HCJ. Below are the details of the request:

        Student Details:
        ● Name: ${firstName} ${lastName}
        ● Email: ${email}
        ● Phone Number: ${userPhone}

        Institution Details:
        ● Institution Name: ${institutionName}
        ● Institution Address: ${institutionAddress}
        ● Institution Email: ${institutionEmail}
        ● Institution Phone Number: ${institutionPhone}
        ● Admin Contact Number: ${adminPhone}

        Please review the request and take the necessary action to onboard this institution.

        Best regards,
        Honour Career Junction Team
      `,
    };

    // Email 3: Thank You Email to the Student
    const thankYouMail = {
      from: process.env.EMAIL_USER,
      to: email, // Student Email
      subject: "Thank You for Requesting Your Institution’s Registration",
      text: `
        Dear ${firstName},

        We've received your request to register your institution on HCJ!

        Thank you for the request to register your institution on HCJ. Your request is important to us, and we’ll be working closely to onboard your institution so you can benefit from India’s biggest job opportunities platform.

        Our team will process this request and notify you once your institution is successfully registered. If you have any questions or need further assistance, feel free to contact us at [Support Email].

        Thank you for choosing HCJ to accelerate your career journey!

        Warm regards,
        Honour Career Junction Team
      `,
    };

    // Send all three emails concurrently
    await Promise.all([
      transporter.sendMail(jobFairAlertMail),
      transporter.sendMail(studentRequestMail),
      transporter.sendMail(thankYouMail),
    ]);

    return NextResponse.json(
      {
        code: "6005_1",
        title: "Success",
        message: "6005_1 Your request submitted successfully",
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      {
        code: "6006_5",
        title: "error",
        message: "6005_2 Internal Server Error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
