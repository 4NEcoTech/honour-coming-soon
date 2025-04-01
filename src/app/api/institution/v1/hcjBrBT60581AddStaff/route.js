import CompanyContactPerson from '@/app/models/company_contact_person';
import { dbConnect } from '@/app/utils/dbConnect';
import { uploadToGoogleDrive } from '@/app/utils/googleDrive';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60581AddStaff:
 *   post:
 *     summary: Add a single Team Member/Staff
 *     description: Adds a new team member or staff by collecting details, generating a unique number, handling document upload, and sending an invitation email.
 *     tags: [Team Member/Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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
 *                 format: binary
 *                 description: Upload the document image.
 *               CCP_Company_Id:
 *                 type: string
 *                 example: "65fa33bb44a98b002b7d72f1"
 *               CCP_Individual_Id:
 *                 type: string
 *                 example: "65fa33bb44a98b002b7d72f2"
 *     responses:
 *       200:
 *         description: Team member added successfully, invitation sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invitation sent successfully"
 *       400:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send invitation"
 */

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const userLang = data.language || 'en';

    // Extract form data
    const CCP_Admin_Invitee_Id = formData.get('CCP_Admin_Invitee_Id'); // New field
    const CCP_Institute_Num = formData.get('CCP_Institute_Num'); // New field
    const CCP_Institute_Name = formData.get('CCP_Institute_Name'); // New field
    const CCP_Contact_Person_First_Name = formData.get(
      'CCP_Contact_Person_First_Name'
    );
    const CCP_Contact_Person_Last_Name = formData.get(
      'CCP_Contact_Person_Last_Name'
    );
    const CCP_Contact_Person_Phone = formData.get('CCP_Contact_Person_Phone');
    const CCP_Contact_Person_Alternate_Phone = formData.get(
      'CCP_Contact_Person_Alternate_Phone'
    );
    const CCP_Contact_Person_Email = formData.get('CCP_Contact_Person_Email');
    const CCP_Contact_Person_Alternate_Email = formData.get(
      'CCP_Contact_Person_Alternate_Email'
    );
    const CCP_Contact_Person_Role = formData.get('CCP_Contact_Person_Role');
    const CCP_Contact_Person_Gender = formData.get('CCP_Contact_Person_Gender');
    const CCP_Contact_Person_DOB = formData.get('CCP_Contact_Person_DOB');
    const CCP_Contact_Person_Country = formData.get(
      'CCP_Contact_Person_Country'
    );
    const CCP_Contact_Person_Pincode = formData.get(
      'CCP_Contact_Person_Pincode'
    );
    const CCP_Contact_Person_State = formData.get('CCP_Contact_Person_State');
    const CCP_Contact_Person_City = formData.get('CCP_Contact_Person_City');
    const CCP_Contact_Person_Address_Line1 = formData.get(
      'CCP_Contact_Person_Address_Line1'
    );
    const CCP_Contact_Person_Joining_Year = formData.get(
      'CCP_Contact_Person_Joining_Year'
    );
    const CCP_Contact_Person_Department = formData.get(
      'CCP_Contact_Person_Department'
    );
    const CCP_Contact_Person_Designation = formData.get(
      'CCP_Contact_Person_Designation'
    );
    const CCP_Contact_Person_Document_Domicile = formData.get(
      'CCP_Contact_Person_Document_Domicile'
    );
    const CCP_Contact_Person_Document_Type = formData.get(
      'CCP_Contact_Person_Document_Type'
    );
    const CCP_Contact_Person_Document_Number = formData.get(
      'CCP_Contact_Person_Document_Number'
    );
    const CCP_Company_Id = formData.get('CCP_Company_Id');
    const CCP_Individual_Id = formData.get('CCP_Individual_Id');

    // Convert DOB to Date format
    const formattedDOB = CCP_Contact_Person_DOB
      ? new Date(CCP_Contact_Person_DOB)
      : null;

    // Check if user already exists
    const existingUser = await CompanyContactPerson.findOne({
      CCP_Contact_Person_Email,
    });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
      });
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

    // Handle file upload (document image)
    let documentUrl = null;
    if (formData.has('CCP_Contact_Person_Document_Picture')) {
      const documentBuffer = Buffer.from(
        await formData.get('CCP_Contact_Person_Document_Picture').arrayBuffer()
      );
      documentUrl = await uploadToGoogleDrive(
        documentBuffer,
        `document_${Date.now()}.png`,
        'image/png'
      );
    }

    // Save data to MongoDB
    const invite = new CompanyContactPerson({
      CCP_Admin_Invitee_Id, // Added to model
      CCP_Institute_Num, // Added to model
      CCP_Institute_Name, // Added to model
      CCP_Contact_PersonNum: nextContactPersonNum,
      CCP_Contact_Person_First_Name,
      CCP_Contact_Person_Last_Name,
      CCP_Contact_Person_Phone,
      CCP_Contact_Person_Alternate_Phone,
      CCP_Contact_Person_Email,
      CCP_Contact_Person_Alternate_Email,
      CCP_Contact_Person_Role,
      CCP_Contact_Person_Gender,
      CCP_Contact_Person_DOB: formattedDOB,
      CCP_Contact_Person_Country,
      CCP_Contact_Person_Pincode,
      CCP_Contact_Person_State,
      CCP_Contact_Person_City,
      CCP_Contact_Person_Address_Line1,
      CCP_Contact_Person_Joining_Year,
      CCP_Contact_Person_Department,
      CCP_Contact_Person_Designation,
      CCP_Contact_Person_Document_Domicile,
      CCP_Contact_Person_Document_Type,
      CCP_Contact_Person_Document_Number,
      CCP_Contact_Person_Document_Picture: documentUrl,
      CCP_Company_Id,
      CCP_Individual_Id,
      CCP_Session_Id: Math.floor(Math.random() * 100000),
    });
    await invite.save();

    // Generate JWT token including all user data
    const token = jwt.sign(
      {
        id: invite._id,
        CCP_Admin_Invitee_Id, // Added to token
        CCP_Institute_Num, // Added to token
        CCP_Institute_Name, // Added to token
        CCP_Contact_Person_First_Name,
        CCP_Contact_Person_Last_Name,
        CCP_Contact_Person_Phone,
        CCP_Contact_Person_Alternate_Phone,
        CCP_Contact_Person_Email,
        CCP_Contact_Person_Alternate_Email,
        CCP_Contact_Person_Role,
        CCP_Contact_Person_Gender,
        CCP_Contact_Person_DOB: formattedDOB,
        CCP_Contact_Person_Country,
        CCP_Contact_Person_Pincode,
        CCP_Contact_Person_State,
        CCP_Contact_Person_City,
        CCP_Contact_Person_Address_Line1,
        CCP_Contact_Person_Joining_Year,
        CCP_Contact_Person_Department,
        CCP_Contact_Person_Designation,
        CCP_Contact_Person_Document_Domicile,
        CCP_Contact_Person_Document_Type,
        CCP_Contact_Person_Document_Number,
        CCP_Contact_Person_Document_Picture: documentUrl,
        CCP_Company_Id,
        CCP_Individual_Id,
        CCP_Contact_PersonNum: nextContactPersonNum,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send email invitation
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const signupUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${userLang}/team-signup?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: CCP_Contact_Person_Email,
      subject: 'Invitation to Join Honour Career Junction',
      html: `
        <p>Dear <b>${CCP_Contact_Person_First_Name} ${CCP_Contact_Person_Last_Name}</b>,</p>
        <p>We are inviting you to join Honour Career Junction (HCJ). Your role as a <b>${CCP_Contact_Person_Role}</b> will be valuable.</p>
        <p>To get started, please follow the steps below:</p>
        <ol>
          <li>Click on the invitation link: <a href="${signupUrl}">here</a></li>
          <li>Use your institutional email ID to sign up.</li>
          <li>Complete your profile setup.</li>
        </ol>
        <p>Best regards,<br/>[Institution Name]</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in invite API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send invitation' }),
      { status: 500 }
    );
  }
}
