import { serverContactSchema, getContactSubmissionModel } from "@/app/models/ContactSubmission";
import { dbConnect } from "@/app/utils/dbConnect";
import { uploadToGoogleDrive } from "@/app/utils/googleDrive";
import nodemailer from "nodemailer";
import { generateAuditTrail } from "@/app/utils/audit-trail";


/**
 * @swagger
 * /api/global/v1/gblBrBT90010Contact:
 *   post:
 *     summary: Submit contact form
 *     description: |
 *       - Submits contact form details.
 *       - Uploads logo to Google Drive (if provided).
 *       - Sends confirmation emails to the user and admin.
 *     tags: [Contact Submission]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               state:
 *                 type: string
 *                 example: "California"
 *               city:
 *                 type: string
 *                 example: "Los Angeles"
 *               message:
 *                 type: string
 *                 example: "I would like more information about your services."
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: "Logo file upload (optional)."
 *     responses:
 *       200:
 *         description: Form submitted successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */


export async function POST(req) {
  try {
    await dbConnect();
    const ContactSubmission = getContactSubmissionModel();
    const formData = await req.formData();

    // Validate form data
    const validatedData = serverContactSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      pincode: formData.get("pincode"),
      country: formData.get("country"),
      state: formData.get("state"),
      city: formData.get("city"),
      message: formData.get("message"),
      logo: formData.get("logo"),
    });

    if (!validatedData.success) {
      return new Response(
        JSON.stringify({ success: false, message: "Validation failed", errors: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const { data } = validatedData;

    // Upload logo to Google Drive and get URL
    let logoUrl = null;
    if (data.logo) {
      const buffer = Buffer.from(await data.logo.arrayBuffer());
      logoUrl = await uploadToGoogleDrive(buffer, `logo_${Date.now()}.png`, "image/png");
    }

    // Generate audit trail
    const auditTrail = await generateAuditTrail(req);

    // Save to MongoDB with Google Drive URL
    const contactSubmission = new ContactSubmission({
      ...data,
      logo: logoUrl, // Store Google Drive URL instead of blob
      audit_trail: [auditTrail],
    });

    await contactSubmission.save();

     // Set up email transporter
     const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Admin email content
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Us Submission",
      text: `
        Hi Team,

        We've received a new inquiry via the Contact Us form. Below are the user's details:

        Name: ${data.firstName} ${data.lastName || ""}
        Phone Number: ${data.phoneNumber || "Not provided"}
        Country: ${data.country || "Not provided"}
        City: ${data.city || "Not provided"}
        Message: ${data.message}
        Logo URL: ${logoUrl || "No logo uploaded"}
        Date and Time of Submission: ${new Date().toLocaleString()}

        Please review and respond promptly to ensure a positive experience for the user.

        Best regards,
        Honour Career Junction Team
      `,
    };
    await transporter.sendMail(adminMailOptions);

    // User confirmation email content
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Thank You for Reaching Out to HCJ",
      text: `
        Dear ${data.firstName},

        Thank you for contacting us! We have received your message and our team will get back to you shortly.

        If you attached a logo, you can access it here: ${logoUrl || "No logo uploaded"}

        For urgent concerns, you can reach out to us at [HCJ Support].

        We appreciate your patience and thank you for choosing HCJ!

        Warm regards,  
        Honour Career Junction Team
      `,
    };
    await transporter.sendMail(userMailOptions);


    return new Response(JSON.stringify({ message: "6011_6 Form submitted successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error during form submission:", error);
    return new Response(JSON.stringify({ message: "6011_7 Error processing the request." }), { status: 500 });
  }
}
