import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';
import Hcj_Job_Seeker from '@/app/models/hcj_job_seeker';
import AddressDetails from '@/app/models/individual_address_detail';
import IndividualDetails from '@/app/models/individual_details';
import IndividualEducation from '@/app/models/individual_education';
import SocialProfile from '@/app/models/social_link';
import User from '@/app/models/user_table';
import { dbConnect } from '@/app/utils/dbConnect';
import { uploadToGoogleDrive } from '@/app/utils/googleDrive';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/student/v1/hcjBrBT60421StudentProfileCreate:
 *   post:
 *     summary: Create a user profile
 *     description: Creates a user profile, stores profile pictures, address, social profiles, and education details.
 *     tags: [User Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               UT_User_Id:
 *                 type: string
 *                 example: "adityakas1907@gmail.com"
 *               ID_First_Name:
 *                 type: string
 *                 example: "John"
 *               ID_Last_Name:
 *                 type: string
 *                 example: "Doe"
 *               ID_Phone:
 *                 type: string
 *                 example: "+919876543210"
 *               ID_Profile_Picture:
 *                 type: string
 *                 format: binary
 *               ID_Cover_Photo:
 *                 type: string
 *                 format: binary
 *               IAD_City:
 *                 type: string
 *                 example: "Bangalore"
 *               IAD_State:
 *                 type: string
 *                 example: "Karnataka"
 *               IAD_Country:
 *                 type: string
 *                 example: "India"
 *               IAD_Pincode:
 *                 type: string
 *                 example: "560001"
 *               SL_Social_Profile_Name:
 *                 type: string
 *                 example: "LinkedIn"
 *               SL_LinkedIn_Profile:
 *                 type: string
 *                 example: "https://linkedin.com/in/johndoe"
 *               IE_Institute_Name:
 *                 type: string
 *                 example: "XYZ University"
 *               IE_Program_Name:
 *                 type: string
 *                 example: "B.Tech Computer Science"
 *               HCJ_JS_Individual_Id:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               HCJ_JS_Location_City:
 *                 type: string
 *                 example: "New York"
 *               HCJ_JS_Location_State:
 *                 type: string
 *                 example: "NY"
 *               HCJ_JS_Location_Country:
 *                 type: string
 *                 example: "USA"
 *               HCJ_JS_Preferred_Work_Location:
 *                 type: string
 *                 example: "Remote"
 *               HCJ_JS_Profile_Picture:
 *                 type: string
 *                 example: "http://example.com/profile.jpg"
 *               HCJ_JS_Current_Company:
 *                 type: string
 *                 example: "Tech Corp"
 *               HCJ_JS_Last_Company:
 *                 type: string
 *                 example: "Innovate Ltd"
 *               HCJ_JS_Designation:
 *                 type: string
 *                 example: "Software Engineer"
 *               HCJ_JS_Profile_HeadIine:
 *                 type: string
 *                 example: "Experienced Software Engineer"
 *               HCJ_JS_Profile_Summary:
 *                 type: string
 *                 example: "Passionate about developing scalable software solutions."
 *               HCJ_JS_Flexible_Work_Hours:
 *                 type: boolean
 *                 example: true
 *               HCJ_JS_Industry:
 *                 type: string
 *                 example: "Information Technology"
 *               HCJ_JS_Institution_Name:
 *                 type: string
 *                 example: "Tech University"
 *               HCJ_JS_Student_Branch_Specialization:
 *                 type: string
 *                 example: "Computer Science"
 *               HCJ_JS_Student_Program_Name:
 *                 type: string
 *                 example: "B.Tech"
 *               HCJ_JS_Enrollment_Year:
 *                 type: number
 *                 example: 2018
 *               HCJ_JS_Current_Year:
 *                 type: number
 *                 example: 3
 *               HCJ_JS_Student_Graduation_Year:
 *                 type: number
 *                 example: 2022
 *               HCJ_JS_Score_Grade_Type:
 *                 type: string
 *                 example: "CGPA"
 *               HCJ_JS_Score_Grade:
 *                 type: number
 *                 example: 8.5
 *               HCJ_JS_Resume_Upload:
 *                 type: string
 *                 example: "http://example.com/resume.pdf"
 *               HCJ_JS_Class_Of_Year:
 *                 type: number
 *                 example: 2022
 *               HCJ_JS_Seeking_Internship:
 *                 type: boolean
 *                 example: false
 *               HCJ_JS_Session_Id:
 *                 type: string
 *                 example: "session12345"
 *               HCJ_JS_Creation_DtTym:
 *                 type: string
 *                 example: "2023-10-01T12:34:56Z"
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Invalid or missing fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    //  Get User Session

    const sessions = await getServerSession(authOptions);
    const sessionId = formData.get('UT_User_Id') || sessions?.user?.id;

    // Check if sessionId is available
    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // ✅ Find User in `user_table`
    const user = await User.findOne({ _id: sessionId });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Handle Image Uploads to Google Drive
    let profilePictureUrl = null;
    let coverPictureUrl = null;

    if (formData.has('ID_Profile_Picture')) {
      const profileBuffer = Buffer.from(
        await formData.get('ID_Profile_Picture').arrayBuffer()
      );
      profilePictureUrl = await uploadToGoogleDrive(
        profileBuffer,
        `profile_${Date.now()}.png`,
        'image/png'
      );
    }

    if (formData.has('ID_Cover_Photo')) {
      const coverBuffer = Buffer.from(
        await formData.get('ID_Cover_Photo').arrayBuffer()
      );
      coverPictureUrl = await uploadToGoogleDrive(
        coverBuffer,
        `cover_${Date.now()}.png`,
        'image/png'
      );
    }

    // Start a MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 2: Create `individual_details`
      const individualDetails = new IndividualDetails({
        ID_User_Id: user._id,
        ID_Profile_Picture: profilePictureUrl,
        ID_Cover_Photo: coverPictureUrl,
        ID_First_Name: formData.get('ID_First_Name'),
        ID_Last_Name: formData.get('ID_Last_Name'),
        ID_Phone: formData.get('ID_Phone'),
        ID_Alternate_Phone: formData.get('ID_Alternate_Phone'),
        ID_Email: formData.get('ID_Email'),
        ID_Alternate_Email: formData.get('ID_Alternate_Email'),
        ID_DOB: formData.get('ID_DOB'),
        ID_Gender: formData.get('ID_Gender'), // Ensure frontend sends '01', '02', '03'
        ID_Profile_Headline: formData.get('ID_Profile_Headline'),
        ID_About: formData.get('ID_About'),//!not getting form Frontend (on screen input is there for student)
        ID_City: formData.get('IAD_City'),
        ID_Individual_Designation: formData.get('ID_Individual_Designation'),//!not getting from  frontend (on screen input is there for student)
        ID_Individual_Role: formData.get('ID_Individual_Role'),
        ID_Audit_Trail: formData.get('ID_Audit_Trail') || [],
      });

      const savedIndividualDetails = await individualDetails.save({ session });

      // Step 3: Save `individual_address_detail`
      const addressDetails = new AddressDetails({
        IAD_Individual_Id: savedIndividualDetails?._id,
        IAD_Address_Type: '02',
        IAD_Address_Custom_Name: formData.get('IAD_Address_Custom_Name'),
        IAD_Address_Line1: formData.get('IAD_Address_Line1'),
        IAD_City: formData.get('IAD_City'),
        IAD_State: formData.get('IAD_State'),
        IAD_Country: formData.get('IAD_Country'),
        IAD_Pincode: formData.get('IAD_Pincode'),
        IAD_Audit_Trail: formData.get('IAD_Audit_Trail') || [],
      });

      await addressDetails.save({ session });

      // Step 4: Save `social_link`
      if (formData.has('SL_Social_Profile_Name')) {
        const socialProfileData = {
          SL_Id: savedIndividualDetails?._id,
          SL_Individual_Role: savedIndividualDetails?.ID_Individual_Role,
          SL_Id_Source: '01',
          SL_Product_Identifier: '10000',
          SL_Social_Profile_Name: formData.get('SL_Social_Profile_Name') || '',
          SL_LinkedIn_Profile: formData.get('SL_LinkedIn_Profile') || '',
          SL_Website_Url: formData.get('SL_Website_Url') || '',
          SL_Instagram_Url: formData.get('SL_Instagram_Url') || '',
          SL_Facebook_Url: formData.get('SL_Facebook_Url') || '',
          SL_Twitter_Url: formData.get('SL_Twitter_Url') || '',
          SL_Pinterest_Url: formData.get('SL_Pinterest_Url') || '',
          SL_Custom_Url: formData.get('SL_Custom_Url') || '',
          SL_Portfolio_Url: formData.get('SL_Portfolio_Url') || '',
        };

        await new SocialProfile(socialProfileData).save({ session });
      }

      // Step 5: Save `individual_education`
      if (formData.has('IE_Institute_Name')) {
        const educationData = {
          IE_Individual_Id: savedIndividualDetails._id,
          IE_Institute_Name: formData.get('IE_Institute_Name'),
          IE_Program_Name: formData.get('IE_Program_Name'),
          IE_Program_Status: formData.get('IE_Program_Status'),
          IE_Specialization: formData.get('IE_Specialization'),
          IE_Start_Date: formData.get('IE_Start_Date'),
          IE_End_Date: formData.get('IE_End_Date'),
          IE_Year: formData.get('IE_Year'),
          IE_Score_Grades: formData.get('IE_Score_Grades'),
          IE_Score_Grades_Value: formData.get('IE_Score_Grades_Value'),
          IE_Audit_Trail: formData.get('IE_Audit_Trail') || [],
        };

        await new IndividualEducation(educationData).save({ session });
      }

      const jobSeekerData = {
        HCJ_JS_Individual_Id: savedIndividualDetails._id,
        HCJ_JS_Location_City: formData.get('IAD_City'),
        HCJ_JS_Location_State: formData.get('IAD_State'),
        HCJ_JS_Location_Country: formData.get('IAD_Country'),
        HCJ_JS_Profile_Picture: profilePictureUrl,
        HCJ_JS_Designation: formData.get('ID_Individual_Designation'),
        HCJ_JS_Profile_HeadIine: formData.get('ID_Profile_Headline'),
        HCJ_JS_Profile_Summary: formData.get('ID_About'),
        HCJ_JS_Industry: formData.get('HCJ_JS_Industry'),
        HCJ_JS_Institution_Name: formData.get('IE_Institute_Name'),
        HCJ_JS_Student_Branch_Specialization: formData.get('IE_Specialization'),
        HCJ_JS_Student_Program_Name: formData.get('IE_Program_Name'),
        HCJ_JS_Enrollment_Year: formData.get('IE_Start_Date'),
        HCJ_JS_Current_Year: formData.get('IE_Year'),
        HCJ_JS_Student_Graduation_Year: formData.get('IE_End_Date'),
        HCJ_JS_Score_Grade_Type: formData.get('IE_Score_Grades'),
        HCJ_JS_Score_Grade: formData.get('IE_Score_Grades_Value'),
        HCJ_JS_Class_Of_Year: formData.get('IE_Year'),
        HCJ_JS_Audit_Trail: [AuditTrailSchema],
      };
      const savedJobSeekerDetails = await new Hcj_Job_Seeker(jobSeekerData).save({ session });
      await session.commitTransaction();
      session.endSession();

      // Step 1: Set `individual_id` in Cookie
      const cookieStore = await cookies();
      await cookieStore.set(
        'individual_id',
        savedIndividualDetails._id.toString(),
        {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Profile created successfully!',
          individualId: savedIndividualDetails._id.toString(),
          jobSeekerId: savedJobSeekerDetails._id.toString(),
        }),
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Transaction Error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Database transaction failed',
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during profile creation:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
