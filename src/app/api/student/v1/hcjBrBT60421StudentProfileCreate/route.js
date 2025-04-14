import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuditTrailSchema } from "@/app/models/common/AuditTrail";
import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";
import AddressDetails from "@/app/models/individual_address_detail";
import IndividualDetails from "@/app/models/individual_details";
import IndividualEducation from "@/app/models/individual_education";
import SocialProfile from "@/app/models/social_link";
import User from "@/app/models/user_table";
import { dbConnect } from "@/app/utils/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { queueStudentEcoLinkCreation } from "@/app/utils/student-queue";

/**
 * @swagger
 * /api/student/v1/hcjBrBT60421StudentProfileCreate:
 *   post:
 *     summary: Create Full Student Profile
 *     description: |
 *       Creates a full student profile with individual details, address, education, social links, and job seeker metadata.
 *       Also triggers background EcoLink creation and sets a cookie with the individual ID.
 *     tags: [Student Profile and EcoLink Creation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_User_Id
 *               - ID_First_Name
 *               - ID_Last_Name
 *               - ID_Phone
 *               - ID_Email
 *               - ID_Gender
 *               - ID_DOB
 *               - IAD_City
 *               - IAD_State
 *               - IAD_Country
 *               - IE_Institute_Name
 *               - IE_Program_Name
 *               - IE_Specialization
 *             properties:
 *               ID_User_Id:
 *                 type: string
 *               ID_First_Name:
 *                 type: string
 *               ID_Last_Name:
 *                 type: string
 *               ID_Phone:
 *                 type: string
 *               ID_Email:
 *                 type: string
 *               ID_Profile_Picture:
 *                 type: string
 *                 format: uri
 *               ID_Cover_Photo:
 *                 type: string
 *                 format: uri
 *               ID_Gender:
 *                 type: string
 *               ID_DOB:
 *                 type: string
 *                 format: date
 *               ID_Profile_Headline:
 *                 type: string
 *               ID_About:
 *                 type: string
 *               ID_Individual_Designation:
 *                 type: string
 *               IAD_Address_Line1:
 *                 type: string
 *               IAD_City:
 *                 type: string
 *               IAD_State:
 *                 type: string
 *               IAD_Country:
 *                 type: string
 *               IAD_Pincode:
 *                 type: string
 *               IAD_Address_Custom_Name:
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
 *               SL_Custom_Url:
 *                 type: string
 *               SL_Portfolio_Url:
 *                 type: string
 *               IE_Institute_Name:
 *                 type: string
 *               IE_Program_Name:
 *                 type: string
 *               IE_Program_Status:
 *                 type: string
 *               IE_Specialization:
 *                 type: string
 *               IE_Start_Date:
 *                 type: string
 *                 format: date
 *               IE_End_Date:
 *                 type: string
 *                 format: date
 *               IE_Year:
 *                 type: string
 *               IE_Score_Grades:
 *                 type: string
 *               IE_Score_Grades_Value:
 *                 type: string
 *               HCJ_JS_Industry:
 *                 type: string
 *               HCJ_JS_Enrollment_Year:
 *                 type: string
 *               HCJ_JS_Student_Graduation_Year:
 *                 type: string
 *               lang:
 *                 type: string
 *                 example: en
 *               route:
 *                 type: string
 *                 example: student-ecolink
 *     responses:
 *       201:
 *         description: Student profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 individualId:
 *                   type: string
 *                 jobSeekerId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const sessionToken = await getServerSession(authOptions);
  const userId = body.UT_User_Id || sessionToken?.user?.id;

  if (!userId) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });

  const user = await User.findById(userId);
  if (!user) return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });

  const session = await mongoose.startSession();

  try {
    // Wrap all transactional operations in withTransaction
    await session.withTransaction(async () => {
      const individual = new IndividualDetails({
        ID_User_Id: userId,
        ID_Profile_Picture: body.ID_Profile_Picture || null,
        ID_Cover_Photo: body.ID_Cover_Photo || null,
        ID_First_Name: body.ID_First_Name,
        ID_Last_Name: body.ID_Last_Name,
        ID_Phone: body.ID_Phone,
        ID_Alternate_Phone: body.ID_Alternate_Phone,
        ID_Email: body.ID_Email,
        ID_Alternate_Email: body.ID_Alternate_Email,
        ID_DOB: body.ID_DOB,
        ID_Gender: body.ID_Gender,
        ID_Profile_Headline: body.ID_Profile_Headline,
        ID_About: body.ID_About,
        ID_City: body.IAD_City,
        ID_Individual_Designation: body.ID_Individual_Designation,
        ID_Individual_Role: body.ID_Individual_Role,
        ID_Audit_Trail: body.ID_Audit_Trail || [],
      });

      const savedIndividual = await individual.save({ session });

      await new AddressDetails({
        IAD_Individual_Id: savedIndividual._id,
        IAD_Address_Type: "02",
        IAD_Address_Custom_Name: body.IAD_Address_Custom_Name,
        IAD_Address_Line1: body.IAD_Address_Line1,
        IAD_City: body.IAD_City,
        IAD_State: body.IAD_State,
        IAD_Country: body.IAD_Country,
        IAD_Pincode: body.IAD_Pincode,
        IAD_Audit_Trail: body.IAD_Audit_Trail || [],
      }).save({ session });

      if (body.SL_Social_Profile_Name) {
        await new SocialProfile({
          SL_Id: savedIndividual._id,
          SL_Individual_Role: savedIndividual.ID_Individual_Role,
          SL_Id_Source: "01",
          SL_Product_Identifier: "10000",
          SL_Social_Profile_Name: body.SL_Social_Profile_Name,
          SL_LinkedIn_Profile: body.SL_LinkedIn_Profile,
          SL_Website_Url: body.SL_Website_Url,
          SL_Instagram_Url: body.SL_Instagram_Url,
          SL_Facebook_Url: body.SL_Facebook_Url,
          SL_Twitter_Url: body.SL_Twitter_Url,
          SL_Pinterest_Url: body.SL_Pinterest_Url,
          SL_Custom_Url: body.SL_Custom_Url,
          SL_Portfolio_Url: body.SL_Portfolio_Url,
        }).save({ session });
      }

      if (body.IE_Institute_Name) {
        await new IndividualEducation({
          IE_Individual_Id: savedIndividual._id,
          IE_Institute_Name: body.IE_Institute_Name,
          IE_Program_Name: body.IE_Program_Name,
          IE_Program_Status: body.IE_Program_Status,
          IE_Specialization: body.IE_Specialization,
          IE_Start_Date: body.IE_Start_Date,
          IE_End_Date: body.IE_End_Date,
          IE_Year: body.IE_Year,
          IE_Score_Grades: body.IE_Score_Grades,
          IE_Score_Grades_Value: body.IE_Score_Grades_Value,
          IE_Audit_Trail: body.IE_Audit_Trail || [],
        }).save({ session });
      }

      await new Hcj_Job_Seeker({
        HCJ_JS_Individual_Id: savedIndividual._id,
        HCJ_JS_Location_City: body.IAD_City,
        HCJ_JS_Location_State: body.IAD_State,
        HCJ_JS_Location_Country: body.IAD_Country,
        HCJ_JS_Profile_Picture: body.ID_Profile_Picture,
        HCJ_JS_Designation: body.ID_Individual_Designation,
        HCJ_JS_Profile_HeadIine: body.ID_Profile_Headline,
        HCJ_JS_Profile_Summary: body.ID_About,
        HCJ_JS_Industry: body.HCJ_JS_Industry,
        HCJ_JS_Institution_Name: body.IE_Institute_Name,
        HCJ_JS_Student_Branch_Specialization: body.IE_Specialization,
        HCJ_JS_Student_Program_Name: body.IE_Program_Name,
        HCJ_JS_Enrollment_Year: body.HCJ_JS_Enrollment_Year,
        HCJ_JS_Student_Graduation_Year: body.HCJ_JS_Student_Graduation_Year,
        HCJ_JS_Current_Year: body.IE_Year,
        HCJ_JS_Score_Grade_Type: body.IE_Score_Grades,
        HCJ_JS_Score_Grade: body.IE_Score_Grades_Value,
        HCJ_JS_Class_Of_Year: body.IE_Year,
        HCJ_JS_Audit_Trail: [AuditTrailSchema],
      }).save({ session });
    });

    // After successful transaction, fetch the saved records
    const savedIndividual = await IndividualDetails.findOne({ ID_User_Id: userId });
    const savedJobSeeker = await Hcj_Job_Seeker.findOne({ HCJ_JS_Individual_Id: savedIndividual._id });

    // Queue EcoLink creation (non-transactional)
    await queueStudentEcoLinkCreation({
      individualId: savedIndividual._id,
      profileName: `${body.ID_First_Name} ${body.ID_Last_Name}`,
      profilePicture: body.ID_Profile_Picture,
      phone: body.ID_Phone,
      email: body.ID_Email,
      address: body.IAD_Address_Line1,
      city: body.IAD_City,
      state: body.IAD_State,
      website: body.SL_Website_Url,
      institute: body.IE_Institute_Name,
      program: body.IE_Program_Name,
      specialization: body.IE_Specialization,
      lang: body.lang || 'en',
      route: body.route || 'student-ecolink',
      designation: body.ID_Individual_Designation 
    });

    // Set cookie
    const cookieStore = await cookies();
    await cookieStore.set("individual_id", savedIndividual._id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile created successfully!",
        individualId: savedIndividual._id.toString(),
        jobSeekerId: savedJobSeeker._id.toString(),
        first_name: body.ID_First_Name,
        last_name: body.ID_Last_Name,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Student Profile Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: error.message 
      }), 
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}