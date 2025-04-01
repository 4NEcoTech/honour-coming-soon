import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CompanyAddressDetails from '@/app/models/company_address_details';
import CompanyDetails from '@/app/models/company_details';
import IndividualDetails from '@/app/models/individual_details';
import SocialProfile from '@/app/models/social_link';
import { dbConnect } from '@/app/utils/dbConnect';
import { uploadToGoogleDrive } from '@/app/utils/googleDrive';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60281CreateInstitutionProfile:
 *   post:
 *     summary: Create Educational Institution Profile
 *     description: Creates an Educational Institution profile, stores institution details, address, and social links.
 *     tags: [Educational Institution Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               UT_User_Id:
 *                 type: string
 *                 example: "admin@university.com"
 *               CD_Company_Name:
 *                 type: string
 *                 example: "ABC University"
 *               CD_Company_Type:
 *                 type: string
 *                 enum: ["Private", "Public"]
 *                 example: "Public"
 *               CD_Company_Establishment_Year:
 *                 type: number
 *                 example: 1990
 *               CD_Company_Email:
 *                 type: string
 *                 example: "info@abcuniversity.com"
 *               CD_Phone_Number:
 *                 type: string
 *                 example: "+919876543210"
 *               CD_Company_Website:
 *                 type: string
 *                 example: "https://www.abcuniversity.com"
 *               CD_Company_Logo:
 *                 type: string
 *                 format: binary
 *               CAD_Address_Line1:
 *                 type: string
 *                 example: "123 University Road"
 *               CAD_Address_Line2:
 *                 type: string
 *                 example: "Building A, Room 101"
 *               CAD_Landmark:
 *                 type: string
 *                 example: "Near Metro Station"
 *               CAD_City:
 *                 type: string
 *                 example: "New Delhi"
 *               CAD_State:
 *                 type: string
 *                 example: "Delhi"
 *               CAD_Country:
 *                 type: string
 *                 example: "India"
 *               CAD_Pincode:
 *                 type: string
 *                 example: "110001"
 *               SL_Social_Profile_Name:
 *                 type: string
 *                 example: "LinkedIn"
 *               SL_LinkedIn_Profile:
 *                 type: string
 *                 example: "https://linkedin.com/company/abcuniversity"
 *     responses:
 *       201:
 *         description: Institution profile created successfully
 *       400:
 *         description: Invalid or missing fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

export async function POST(req) {
  let session;
  let transactionCommitted = false; // Flag to track transaction state

  try {
    await dbConnect();
    const formData = await req.formData();

    // const data1 = {};

    // for (const [key, value] of formData.entries()) {
    //   data1[key] = value;
    // }
    // console.log(data1, 'data1');

    // Start MongoDB transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const sessions = await getServerSession(authOptions);
    const sessionId =
      formData.get('CD_User_Id') || sessions?.user?.individualId;

    // Check if sessionId is available
    if (!sessionId) {
      session.endSession();
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Find user
    const Individual = await IndividualDetails.findOne({
      _id: sessionId,
    }).session(session);
    if (!Individual) {
      session.endSession();
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    let institutionLogoUrl = null;
    if (formData.has('CD_Company_Logo')) {
      const file = formData.get('CD_Company_Logo');
      if (file instanceof Blob) {
        try {
          const logoBuffer = Buffer.from(await file.arrayBuffer()); // Convert file to Buffer
          institutionLogoUrl = await uploadToGoogleDrive(
            logoBuffer,
            `logo_${Date.now()}.png`,
            'image/png'
          );
        } catch (error) {
          console.error('Error processing file upload:', error);
          institutionLogoUrl = null;
        }
      }
    }

    // Check if the company already exists (Prevent duplicate inserts)
    const existingCompany = await CompanyDetails.findOne({
      CD_Individual_Id: Individual._id,
      CD_Company_Name: formData.get('CD_Company_Name'),
    }).session(session);

    if (existingCompany) {
      session.endSession();
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Company already exists!',
        }),
        { status: 409 }
      );
    }

    // Create institution details
    const companyDetails = new CompanyDetails({
      CD_Individual_Id: Individual._id,
      CD_Company_Name: formData.get('CD_Company_Name'),
      CD_Company_Type: formData.get('CD_Company_Type'),
      CD_Company_Establishment_Year: formData.get(
        'CD_Company_Establishment_Year'
      ),
      CD_Company_Email: formData.get('CD_Company_Email'),
      CD_Company_About:'Tell us about your company! Share your mission, values, and what you do.',
      CD_Phone_Number: formData.get('CD_Phone_Number'),
      CD_Company_Website: formData.get('CD_Company_Website'),
      CD_Company_Logo: institutionLogoUrl,
      CD_Audit_Trail: formData.get('CD_Audit_Trail') || [],
    });

    const savedCompanyDetails = await companyDetails.save({ session });

    // Create institution address details
    const companyAddressDetails = new CompanyAddressDetails({
      CAD_Company_Id: savedCompanyDetails._id,
      CAD_Address_Type: 'Registered',
      CAD_Address_Line1: formData.get('CAD_Address_Line1'),
      CAD_Address_Line2: formData.get('CAD_Address_Line2'),
      CAD_Landmark: formData.get('CAD_Landmark'),
      CAD_City: formData.get('CAD_City'),
      CAD_State: formData.get('CAD_State'),
      CAD_Country: formData.get('CAD_Country'),
      CAD_Pincode: formData.get('CAD_Pincode'),
      CAD_Audit_Trail: formData.get('CAD_Audit_Trail') || [],
    });

    await companyAddressDetails.save({ session });

    await new SocialProfile({
      SL_Id: savedCompanyDetails._id,
      SL_Individual_Role: '06',
      SL_Product_Identifier: '10000',
      SL_Social_Profile_Name: formData.get('SL_Social_Profile_Name') || '',
      SL_LinkedIn_Profile: formData.get('SL_LinkedIn_Profile') || '',
      SL_Website_Url: formData.get('SL_Website_Url') || '',
      SL_Instagram_Url: formData.get('SL_Instagram_Url') || '',
      SL_Facebook_Url: formData.get('SL_Facebook_Url') || '',
      SL_Twitter_Url: formData.get('SL_Twitter_Url') || '',
      SL_Pinterest_Url: formData.get('SL_Pinterest_Url') || '', // spell-checker: disable-line
      SL_Custom_Url: formData.get('SL_Custom_Url') || '',
      SL_Portfolio_Url: formData.get('SL_Portfolio_Url') || '',
    }).save({ session });

    await session.commitTransaction();
    transactionCommitted = true; // Mark transaction as committed

    // Set `company_id` in Cookie
    const cookieStore = await cookies();
    await cookieStore.set('company_id', savedCompanyDetails._id.toString(), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    session.endSession();
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Institution profile created successfully!',
        companyId: savedCompanyDetails._id.toString(),
      }),
      { status: 201 }
    );
  } catch (error) {
    if (session && !transactionCommitted) {
      await session.abortTransaction(); // Only abort if not already committed
    }
    console.error('Transaction Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Database transaction failed',
      }),
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession(); // Ensure session is always closed
    }
  }
}
