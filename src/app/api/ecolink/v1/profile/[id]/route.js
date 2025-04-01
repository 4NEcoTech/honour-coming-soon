import { dbConnect } from '@/app/utils/dbConnect';
import IndividualDetails from '@/app/models/individual_details';
import EcoLink from '@/app/models/ecl_ecolink';


/**
 * @swagger
 * /api/ecolink/v1/profile/{id}:
 *   get:
 *     summary: Get Student Profile
 *     description: Fetches combined student profile data from individual_details and ecl_ecolink collections.
 *     tags: [Admin EcoLInk Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the student (used as _id and ECL_EL_Id)
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
 *                   example: true
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: "67e7ce94145fb7f2b2830ed7"
 *                     fullName: "Aditya Kasaudhan"
 *                     email: "aditya@example.com"
 *                     ECL_EL_Id: "67e7ce94145fb7f2b2830ed7"
 *                     socialLinks:
 *                       linkedin: "https://linkedin.com/in/aditya"
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Profile not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Fetch profile data from both collections
    const [individualDetails, ecoLink] = await Promise.all([
      IndividualDetails.findOne({ _id: id }).lean(),
      EcoLink.findOne({ ECL_EL_Id: id }).lean()
    ]);

    if (!individualDetails || !ecoLink) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Profile not found' 
        }),
        { status: 404 }
      );
    }

    // Combine the data
    const profileData = {
      ...individualDetails,
      ...ecoLink
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: profileData 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error' 
      }),
      { status: 500 }
    );
  }
}