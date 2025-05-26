import { dbConnect } from '@/app/utils/dbConnect';
import IndividualDetails from '@/app/models/individual_details';
import EcoLink from '@/app/models/ecl_ecolink';
import IndividualDesignation from '@/app/models/ecl_individual_details';
import SocialProfile from '@/app/models/social_link';

/**
 * @swagger
 * /api/ecolink/v1/administrator-ecolink/{id}:
 *   get:
 *     summary: Get Administrator Profile with Social Links
 *     description: Fetches complete admin profile data including EcoLink data, designation, and social links.
 *     tags: [Admin EcoLink Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the administrator
 *     responses:
 *       200:
 *         description: Profile fetched successfully
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
 *                     designation:
 *                       type: string
 *                     socialLinks:
 *                       type: object
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const [individualDetails, ecoLink, designation, socialProfile] = await Promise.all([
      IndividualDetails.findOne({ _id: id }).select('ID_Individual_Designation').lean(),
      EcoLink.findOne({ ECL_EL_Id: id }).lean(),
      IndividualDesignation.findOne({ ECL_EID_Individual_Id: id }).lean(),
      SocialProfile.findOne({ SL_Id: id }).lean()
    ]);

    if (!ecoLink) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'EcoLink data not found'
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
      designation: designation?.ECL_EID_Current_Designation || individualDetails?.ID_Individual_Designation || '',
      socialLinks: formattedSocialLinks
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
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
