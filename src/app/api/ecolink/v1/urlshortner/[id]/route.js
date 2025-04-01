import { dbConnect } from '@/app/utils/dbConnect';
import IndividualDetails from '@/app/models/individual_details';
import EcoLink from '@/app/models/ecl_ecolink';
import mongoose from 'mongoose';

export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = context.params;

    console.log(' Incoming ID:', id);
    let individualDetails = null;

    //  If it's a valid ObjectId, check as `_id`
    if (mongoose.Types.ObjectId.isValid(id)) {
      console.log(' Trying as _id...');
      individualDetails = await IndividualDetails.findOne({ _id: id }).lean();
    }

    //  If it's a valid ObjectId, try as `ID_User_Id` (stored as ObjectId)
    if (!individualDetails && mongoose.Types.ObjectId.isValid(id)) {
      console.log('🧪 Trying as ID_User_Id...');
      individualDetails = await IndividualDetails.findOne({
        ID_User_Id: new mongoose.Types.ObjectId(id),
      }).lean();
    }

    // Try as `ID_Email` (case-insensitive string)
    if (!individualDetails && typeof id === 'string' && id.includes('@')) {
      console.log('Trying as ID_Email...');
      individualDetails = await IndividualDetails.findOne({
        ID_Email: { $regex: `^${id}$`, $options: 'i' },
      }).lean();
    }

    // Not found
    if (!individualDetails) {
      console.log('No individual found for:', id);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Individual not found using _id, user ID, or email',
        }),
        { status: 404 }
      );
    }

    // Now fetch ecoLink using _id of individualDetails
    const ecoLink = await EcoLink.findOne({ ECL_EL_Id: individualDetails._id }).lean();

    if (!ecoLink) {
      console.log('No EcoLink found for:', individualDetails._id);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'EcoLink not found for this user',
        }),
        { status: 404 }
      );
    }

    const profileData = {
      ...individualDetails,
      ...ecoLink,
    };

    return new Response(
      JSON.stringify({ success: true, data: profileData }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Internal Error fetching profile:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
