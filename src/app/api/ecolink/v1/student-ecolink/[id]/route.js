import { dbConnect } from '@/app/utils/dbConnect';
import IndividualDetails from '@/app/models/individual_details';
import EcoLink from '@/app/models/ecl_ecolink';
import IndividualDesignation from '@/app/models/ecl_individual_details';
import SocialProfile from '@/app/models/social_link';
import IndividualEducation from '@/app/models/individual_education';
import Hcj_Job_Seeker from '@/app/models/hcj_job_seeker';

/**
 * @swagger
 * /api/ecolink/v1/student-ecolink/v1/{id}:
 *   get:
 *     summary: Get Student Profile with EcoLink Data
 *     description: Fetches complete student profile including EcoLink, education, job seeker info, and social links.
 *     tags: [Student EcoLink Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the student
 *     responses:
 *       200:
 *         description: Student profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ecoLinkData:
 *                       type: object
 *                     education:
 *                       type: object
 *                     jobSeekerInfo:
 *                       type: object
 *                     socialLinks:
 *                       type: object
 *                     designation:
 *                       type: string
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const [
      ecoLink,
      designation,
      socialProfile,
      education,
      jobSeekerInfo
    ] = await Promise.all([
      EcoLink.findOne({ ECL_EL_Id: id }).lean(),
      IndividualDesignation.findOne({ ECL_EID_Individual_Id: id }).lean(),
      SocialProfile.findOne({ SL_Id: id }).lean(),
      IndividualEducation.findOne({ IE_Individual_Id: id }).lean(),
      Hcj_Job_Seeker.findOne({ HCJ_JS_Individual_Id: id }).lean()
    ]);

    if (!ecoLink) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Student EcoLink data not found'
        }),
        { status: 404 }
      );
    }

    const formattedSocialLinks = {
      linkedin: socialProfile?.SL_LinkedIn_Profile || '',
      website: socialProfile?.SL_Website_Url || '',
      instagram: socialProfile?.SL_Instagram_Url || '',
      facebook: socialProfile?.SL_Facebook_Url || '',
      twitter: socialProfile?.SL_Twitter_Url || '',
      pinterest: socialProfile?.SL_Pinterest_Url || '',
      custom: socialProfile?.SL_Custom_Url || '',
      portfolio: socialProfile?.SL_Portfolio_Url || '',
      profileName: socialProfile?.SL_Social_Profile_Name || ''
    };

    const responseData = {
      ecoLinkData: ecoLink,
      education: education || null,
      jobSeekerInfo: jobSeekerInfo || null,
      socialLinks: formattedSocialLinks,
      designation: designation?.ECL_EID_Current_Designation || ''
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      }),
      { status: 500 }
    );
  }
}