import { dbConnect } from '@/app/utils/dbConnect';
import EcoLink from '@/app/models/ecl_ecolink';
import SocialProfile from '@/app/models/social_link';
import CompanyProfile from '@/app/models/ecl_company_profile';

/**
 * @swagger
 * /api/ecolink/v1/institution-ecolink/{id}:
 *   get:
 *     summary: Get Institution Profile with Social Links
 *     description: Fetches institution EcoLink data, establishment year, specialization, size, and social links.
 *     tags: [Institution EcoLink Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the institution
 *     responses:
 *       200:
 *         description: Institution profile fetched successfully
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
 *                     establishmentYear:
 *                       type: number
 *                     companySize:
 *                       type: number
 *                     specialization:
 *                       type: string
 *                     socialLinks:
 *                       type: object
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const [ecoLink, companyProfile, socialProfile] = await Promise.all([
      EcoLink.findOne({ ECL_EL_Id: id, ECL_EL_Id_Source: 'CompanyDetails' }).lean(),
      CompanyProfile.findOne({ ECL_ECP_Company_Id: id }).lean(),
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
      profileName: socialProfile?.SL_Social_Profile_Name || ecoLink?.ECL_EL_EcoLink_Name || ''
    };

    const responseData = {
      ecoLinkData: {
        qrCode: ecoLink.ECL_EL_EcoLink_QR_Code,
        name: ecoLink.ECL_EL_EcoLink_Name,
        city: ecoLink.ECL_EL_Current_City,
        state: ecoLink.ECL_EL_Current_State,
        profilePicture: ecoLink.ECL_EL_Profile_Url,
        email: ecoLink.ECL_EL_Email_Address,
        phone: ecoLink.ECL_EL_Phone_Number,
        website: ecoLink.ECL_EL_Website_Url,
      },
      establishmentYear: companyProfile?.ECL_ECP_Establishment_Year || null,
      companySize: companyProfile?.ECL_ECP_Company_Size || null,
      specialization: companyProfile?.ECL_ECP_Company_Specialization || '',
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
    console.error('Error fetching institution profile:', error);
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
