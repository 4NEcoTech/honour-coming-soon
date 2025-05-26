import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CompanyAddressDetails from '@/app/models/company_address_details';
import CompanyDetails from '@/app/models/company_details';
import IndividualDetails from '@/app/models/individual_details';
import SocialProfile from '@/app/models/social_link';
import { queueCompanyEcoLinkCreation } from '@/app/utils/admin-company-queue';
import { dbConnect } from '@/app/utils/dbConnect';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import CompanyVisibility from "@/app/models/company_info_visibility"; 

/**
 * @swagger
 * /api/employee/v1/hcjBrBT60152CreateCompanyProfile:
 *   post:
 *     summary: Create Employer Company Profile
 *     description: >
 *       Creates a new company profile for an employer, including:  
 *       - Company Details  
 *       - Company Address  
 *       - Social Profile  
 *       Triggers EcoLink generation and sets a cookie `employer_company_id` on success.
 *     tags:
 *       - Employer Create Company Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CD_Company_Name
 *               - CD_Company_Type
 *               - CD_Company_Size
 *               - CD_Company_Industry
 *               - CD_Company_Email
 *               - CD_Phone_Number
 *               - CD_Company_Website
 *               - CAD_Address_Line1
 *               - CAD_City
 *               - CAD_State
 *               - CAD_Country
 *               - CAD_Pincode
 *             properties:
 *               CD_User_Id:
 *                 type: string
 *                 description: Optional ID of the user creating the company
 *               CD_Company_Name:
 *                 type: string
 *               CD_Company_Type:
 *                 type: string
 *               CD_Company_Size:
 *                 type: string
 *               CD_Company_Industry:
 *                 type: string
 *               CD_Company_Industry_SubCategory:
 *                 type: string
 *               CD_Company_Email:
 *                 type: string
 *               CD_Phone_Number:
 *                 type: string
 *               CD_Company_Website:
 *                 type: string
 *               CD_Company_About:
 *                 type: string
 *               CD_Company_Mission:
 *                 type: string
 *               CD_Company_Logo:
 *                 type: string
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
 *                 default: en
 *     responses:
 *       201:
 *         description: Company profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Company profile created successfully!
 *                 companyId:
 *                   type: string
 *                 hasLogo:
 *                   type: boolean
 *       401:
 *         description: Unauthorized (missing session or user)
 *       404:
 *         description: User not found
 *       409:
 *         description: Company already exists
 *       500:
 *         description: Internal Server Error during profile creation
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
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const individual = await IndividualDetails.findById(sessionId).session(session);
    if (!individual) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    const existingCompany = await CompanyDetails.findOne({
      CD_Individual_Id: individual._id,
      CD_Company_Name: body.CD_Company_Name,
    }).session(session);

    if (existingCompany) {
      return new Response(JSON.stringify({ success: false, message: 'Company already exists!' }), { status: 409 });
    }

    const companyDetails = new CompanyDetails({
      CD_Individual_Id: individual._id,
      CD_Company_Name: body.CD_Company_Name,
      CD_Company_Type: body.CD_Company_Type,
      CD_Company_Size: body.CD_Company_Size,
      CD_Company_Industry: body.CD_Company_Industry,
      CD_Company_Industry_SubCategory: body.CD_Company_Industry_SubCategory,
      CD_Company_Email: body.CD_Company_Email,
      CD_Company_About: body.CD_Company_About || 'Tell us about your company!',
      CD_Company_Mission: body.CD_Company_Mission || 'Tell us your company mission!',
      CD_Phone_Number: body.CD_Phone_Number,
      CD_Company_Website: body.CD_Company_Website,
      CD_Company_Logo: body.CD_Company_Logo || null,
      CD_Audit_Trail: body.CD_Audit_Trail || [],
    });

    const savedCompanyDetails = await companyDetails.save({ session });

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

    await new SocialProfile({
      SL_Id: savedCompanyDetails._id,
      SL_Individual_Role: '09', // Employer Admin
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

    //  Add visibility
    await new CompanyVisibility({
      CIV_Company_Id: savedCompanyDetails._id,
      CIV_Company_Email: true,
      CIV_Company_Phone: true,
      CIV_Company_Website: true,
      CIV_Address_Line1: true,
      CIV_Address_Line2: false,
      CIV_Landmark: false,
      CIV_Pincode: true,
      CIV_Creation_DtTym: new Date(),
      CIV_Audit_Trail: [],
    }).save({ session });


    await session.commitTransaction();
    transactionCommitted = true;

    await queueCompanyEcoLinkCreation({
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
      industry: body.CD_Company_Industry,
      size: body.CD_Company_Size,
      lang: body.lang || 'en',
      route: 'company-ecolink',
    });

    const cookieStore = await cookies();
    cookieStore.set('employer_company_id', savedCompanyDetails._id.toString(), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Company profile created successfully!',
        companyId: savedCompanyDetails._id.toString(),
        hasLogo: !!body.CD_Company_Logo,
      }),
      { status: 201 }
    );
  } catch (error) {
    if (session && !transactionCommitted) await session.abortTransaction();
    console.error('Transaction Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Profile creation failed', error: error.message }),
      { status: 500 }
    );
  } finally {
    if (session) session.endSession();
  }
}