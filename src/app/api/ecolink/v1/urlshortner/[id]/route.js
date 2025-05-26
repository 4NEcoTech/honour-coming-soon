import { dbConnect } from "@/app/utils/dbConnect";
import IndividualDetails from "@/app/models/individual_details";
import EcoLink from "@/app/models/ecl_ecolink";
import SocialLink from '@/app/models/social_link';
import mongoose from "mongoose";

/**
 * @swagger
 * /api/ecolink/v1/urlshortner/{id}:
 *   get:
 *     summary: Get public profile data of an individual
 *     description: >
 *       Fetches public profile data of a user using one of the following identifiers:  
 *       - MongoDB `_id`  
 *       - `ID_User_Id`  
 *       - Email address (case-insensitive)  
 *       
 *       Combines data from:
 *       - `individual_details`
 *       - `ecl_ecolink`
 *       - `social_link`
 *       
 *       Fails with `404` if the individual or their EcoLink is not found.
 *     tags:
 *       - Get Admin Ecolink For Mobile Application
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB `_id`, `ID_User_Id`, or email address of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public profile data retrieved successfully
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
 *                   description: Merged object from individual_details, ecl_ecolink, and social_link
 *       404:
 *         description: Individual or EcoLink not found
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
 *       500:
 *         description: Internal server error
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
 *                 error:
 *                   type: string
 */


export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = context.params;

    console.log(" Incoming ID:", id);
    let individualDetails = null;

    //  If it's a valid ObjectId, check as `_id`
    if (mongoose.Types.ObjectId.isValid(id)) {
      console.log(" Trying as _id...");
      individualDetails = await IndividualDetails.findOne({ _id: id }).lean();
    }

    //  If it's a valid ObjectId, try as `ID_User_Id` (stored as ObjectId)
    if (!individualDetails && mongoose.Types.ObjectId.isValid(id)) {
      console.log("🧪 Trying as ID_User_Id...");
      individualDetails = await IndividualDetails.findOne({
        ID_User_Id: new mongoose.Types.ObjectId(id),
      }).lean();
    }

    // Try as `ID_Email` (case-insensitive string)
    if (!individualDetails && typeof id === "string" && id.includes("@")) {
      console.log("Trying as ID_Email...");
      individualDetails = await IndividualDetails.findOne({
        ID_Email: { $regex: `^${id}$`, $options: "i" },
      }).lean();
    }

    // After fetching ecoLink
    const socialLink = await SocialLink.findOne({
      SL_Id: individualDetails._id, // ✅ Use SL_Id to match user
    }).lean();

    // Not found
    if (!individualDetails) {
      console.log("No individual found for:", id);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Individual not found using _id, user ID, or email",
        }),
        { status: 404 }
      );
    }

    // Now fetch ecoLink using _id of individualDetails
    const ecoLink = await EcoLink.findOne({
      ECL_EL_Id: individualDetails._id,
    }).lean();

    if (!ecoLink) {
      console.log("No EcoLink found for:", individualDetails._id);
      return new Response(
        JSON.stringify({
          success: false,
          message: "EcoLink not found for this user",
        }),
        { status: 404 }
      );
    }

    const profileData = {
      ...individualDetails,
      ...ecoLink,
      ...socialLink,
    };

    return new Response(JSON.stringify({ success: true, data: profileData }), {
      status: 200,
    });
  } catch (error) {
    console.error("Internal Error fetching profile:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
