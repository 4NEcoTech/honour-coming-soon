import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CompanyAddressDetails from '@/app/models/company_address_details';
import CompanyDetails from '@/app/models/company_details';
import IndividualDetails from '@/app/models/individual_details';
import SocialProfile from '@/app/models/social_link';
import { dbConnect } from '@/app/utils/dbConnect';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { queueEcoLinkCreation } from '@/app/utils/admin-institution-queue';

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60281CreateInstitutionProfile:
 *   post:
 *     summary: Create Institution Profile
 *     description: |
 *       Creates a new institution profile including company details, address, social profiles, and queues an EcoLink for indexing.
 *       Also sets a cookie with the `company_id` for session persistence.
 *     tags: [Institution Profile And Ecolink Creation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CD_Company_Name
 *               - CD_Company_Type
 *               - CD_Company_Establishment_Year
 *               - CD_Company_Email
 *               - CD_Phone_Number
 *               - CAD_Address_Line1
 *               - CAD_City
 *               - CAD_State
 *               - CAD_Country
 *               - CAD_Pincode
 *             properties:
 *               CD_User_Id:
 *                 type: string
 *                 description: User ID (optional if session exists)
 *               CD_Company_Name:
 *                 type: string
 *               CD_Company_Type:
 *                 type: string
 *               CD_Company_Establishment_Year:
 *                 type: string
 *               CD_Company_Email:
 *                 type: string
 *               CD_Company_About:
 *                 type: string
 *               CD_Phone_Number:
 *                 type: string
 *               CD_Company_Website:
 *                 type: string
 *               CD_Company_Logo:
 *                 type: string
 *                 format: uri
 *               CAD_Address_Line1:
 *                 type: string
 *               CAD_Address_Line2:
 *                 type: string
 *               CAD_Landmark:
 *                 type: string
 *               CAD_City:
 *                 type: string
 *               CAD_State:
 *                 type: string
 *               CAD_Country:
 *                 type: string
 *               CAD_Pincode:
 *                 type: string
 *               SL_Social_Profile_Name:
 *                 type: string
 *               SL_LinkedIn_Profile:
 *                 type: string
 *               SL_Website_Url:
 *                 type: string
 *               SL_Instagram_Url:
 *                 type: string
 *               SL_Facebook_Url:
 *                 type: string
 *               SL_Twitter_Url:
 *                 type: string
 *               SL_Pinterest_Url:
 *                 type: string
 *               SL_Custom_Url:
 *                 type: string
 *               SL_Portfolio_Url:
 *                 type: string
 *               lang:
 *                 type: string
 *                 example: en
 *     responses:
 *       201:
 *         description: Institution profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 companyId:
 *                   type: string
 *                 hasLogo:
 *                   type: boolean
 *       400:
 *         description: Bad request or missing fields
 *       401:
 *         description: Unauthorized (session/user missing)
 *       404:
 *         description: Individual user not found
 *       409:
 *         description: Company already exists
 *       500:
 *         description: Internal Server Error
 */


export async function POST(req) {
  let session;
  let transactionCommitted = false;

  try {
    await dbConnect();
    const body = await req.json();

    session = await mongoose.startSession();
    session.startTransaction();

    const sessions = await getServerSession(authOptions);
    const sessionId = body.CD_User_Id || sessions?.user?.individualId;

    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }), 
        { status: 401 }
      );
    }

    const individual = await IndividualDetails.findById(sessionId).session(session);
    if (!individual) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }), 
        { status: 404 }
      );
    }

    const existingCompany = await CompanyDetails.findOne({
      CD_Individual_Id: individual._id,
      CD_Company_Name: body.CD_Company_Name,
    }).session(session);

    if (existingCompany) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company already exists!' }), 
        { status: 409 }
      );
    }

    const companyDetails = new CompanyDetails({
      CD_Individual_Id: individual._id,
      CD_Company_Name: body.CD_Company_Name,
      CD_Company_Type: body.CD_Company_Type,
      CD_Company_Establishment_Year: body.CD_Company_Establishment_Year,
      CD_Company_Email: body.CD_Company_Email,
      CD_Company_About: body.CD_Company_About || 'Tell us about your company!',
      CD_Phone_Number: body.CD_Phone_Number,
      CD_Company_Website: body.CD_Company_Website,
      CD_Company_Logo: body.CD_Company_Logo || null,
      CD_Audit_Trail: body.CD_Audit_Trail || [],
    });

    const savedCompanyDetails = await companyDetails.save({ session });

    // Save address details
    const companyAddressDetails = new CompanyAddressDetails({
      CAD_Company_Id: savedCompanyDetails._id,
      CAD_Address_Type: 'Registered',
      CAD_Address_Line1: body.CAD_Address_Line1,
      CAD_Address_Line2: body.CAD_Address_Line2,
      CAD_Landmark: body.CAD_Landmark,
      CAD_City: body.CAD_City,
      CAD_State: body.CAD_State,
      CAD_Country: body.CAD_Country,
      CAD_Pincode: body.CAD_Pincode,
      CAD_Audit_Trail: body.CAD_Audit_Trail || [],
    });

    await companyAddressDetails.save({ session });

    // Save social profiles
    await new SocialProfile({
      SL_Id: savedCompanyDetails._id,
      SL_Individual_Role: '06', // Institution role code
      SL_Product_Identifier: '10000',
      SL_Social_Profile_Name: body.SL_Social_Profile_Name || '',
      SL_LinkedIn_Profile: body.SL_LinkedIn_Profile || '',
      SL_Website_Url: body.SL_Website_Url || '',
      SL_Instagram_Url: body.SL_Instagram_Url || '',
      SL_Facebook_Url: body.SL_Facebook_Url || '',
      SL_Twitter_Url: body.SL_Twitter_Url || '',
      SL_Pinterest_Url: body.SL_Pinterest_Url || '',
      SL_Custom_Url: body.SL_Custom_Url || '',
      SL_Portfolio_Url: body.SL_Portfolio_Url || '',
    }).save({ session });

    await session.commitTransaction();
    transactionCommitted = true;

    // Queue EcoLink creation
    await queueEcoLinkCreation({
      companyId: savedCompanyDetails._id,
      idSource: 'CompanyDetails',
      profileName: body.CD_Company_Name,
      profilePicture: body.CD_Company_Logo,
      phone: body.CD_Phone_Number,
      email: body.CD_Company_Email,
      address: body.CAD_Address_Line1,
      city: body.CAD_City,
      state: body.CAD_State,
      website: body.CD_Company_Website,
      lang: body.lang || 'en',
      route: 'institution-ecolink',
      establishmentYear: body.CD_Company_Establishment_Year
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('company_id', savedCompanyDetails._id.toString(), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Institution profile created successfully!',
        companyId: savedCompanyDetails._id.toString(),
        hasLogo: !!body.CD_Company_Logo,
      }),
      { status: 201 }
    );

  } catch (error) {
    if (session && !transactionCommitted) await session.abortTransaction();
    console.error('Transaction Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Profile creation failed',
        error: error.message 
      }), 
      { status: 500 }
    );
  } finally {
    if (session) session.endSession();
  }
}