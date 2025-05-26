import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IndividualDesignation from "@/app/models/ecl_individual_details"; // Import the designation model
import AddressDetails from "@/app/models/individual_address_detail";
import IndividualDetails from "@/app/models/individual_details";
import IndividualVisibility from "@/app/models/individual_info_visibility";
import SocialProfile from "@/app/models/social_link";
import User from "@/app/models/user_table";
import { queueEcoLinkCreation } from "@/app/utils/admin-queue";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

/**
 * @swagger
 * /api/institution/v1/hcjBrBT60241CreateAdminProfile:
 *   post:
 *     summary: Create Admin/User Profile
 *     description: |
 *       Creates a full user profile (Admin or general user) with individual details, address, social links, and current designation.
 *       Also sets a cookie for `individual_id` and queues EcoLink creation in the background.
 *     tags: [Admin/User Profile and EcoLink Creation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_First_Name
 *               - ID_Last_Name
 *               - ID_Phone
 *               - ID_Email
 *               - ID_DOB
 *               - ID_Gender
 *               - IAD_City
 *               - IAD_State
 *               - IAD_Country
 *             properties:
 *               ID_Profile_Picture:
 *                 type: string
 *                 format: uri
 *                 example: https://cdn.com/images/avatar.png
 *               ID_First_Name:
 *                 type: string
 *               ID_Last_Name:
 *                 type: string
 *               ID_Phone:
 *                 type: string
 *               ID_Email:
 *                 type: string
 *               ID_DOB:
 *                 type: string
 *                 format: date
 *               ID_Gender:
 *                 type: string
 *               ID_About:
 *                 type: string
 *               ID_Individual_Designation:
 *                 type: string
 *               ID_Profile_Headline:
 *                 type: string
 *               IAD_Address_Line1:
 *                 type: string
 *               IAD_Address_Line2:
 *                 type: string
 *               IAD_Landmark:
 *                 type: string
 *               IAD_City:
 *                 type: string
 *               IAD_State:
 *                 type: string
 *               IAD_Country:
 *                 type: string
 *               IAD_Pincode:
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
 *               route:
 *                 type: string
 *                 example: user-ecolink
 *     responses:
 *       201:
 *         description: Profile created successfully
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
 *                   example: Profile created successfully!
 *                 individualId:
 *                   type: string
 *                 hasProfilePicture:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - session missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

export async function POST(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  try {
    const startTime = Date.now();
    await dbConnect();
    const body = await req.json();

    const sessions = await getServerSession(authOptions);
    const sessionId = body.ID_User_Id || sessions?.user?.id;

    if (!sessionId) {
      return new Response(
        JSON.stringify({
          code: "6024_16",
          success: false,
          title: t(`errorCode.6024_16.title`),
          message: t(`errorCode.6024_16.description`),
        }),
        { status: 401 }
      );
    }

    const user = await User.findById(sessionId);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          code: "6024_17",
          title: t(`errorCode.6024_17.title`),
          message: t(`errorCode.6024_17.description`),
        }),
        { status: 404 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create individual details
      const individualDetails = new IndividualDetails({
        ID_User_Id: sessionId,
        ID_Profile_Picture: body.ID_Profile_Picture || null,
        ID_First_Name: body.ID_First_Name,
        ID_Last_Name: body.ID_Last_Name,
        ID_Phone: body.ID_Phone,
        ID_Alternate_Phone: body.ID_Alternate_Phone,
        ID_Email: body.ID_Email,
        ID_Alternate_Email: body.ID_Alternate_Email,
        ID_DOB: body.ID_DOB,
        ID_Gender: body.ID_Gender,
        ID_Individual_Role: user.UT_User_Role,
        ID_About: body.ID_About,
        ID_Individual_Designation: body.ID_Individual_Designation,
        ID_Profile_Headline: body.ID_Profile_Headline,
        ID_City: body.IAD_City,
        ID_Audit_Trail: body.ID_Audit_Trail || [],
      });

      const savedIndividualDetails = await individualDetails.save({ session });

      // Create designation record in ECL_INDIVIDUAL_DTLS
      const designationRecord = new IndividualDesignation({
        ECL_EID_Individual_Id: savedIndividualDetails._id,
        ECL_EID_Current_Designation: body.ID_Individual_Designation || "",
        ECL_EID_Session_Id: Date.now(),
        ECL_EID_Audit_Trail: "Profile created via API",
      });
      await designationRecord.save({ session });

      // Parallel saves for address and social
      await Promise.all([
        new AddressDetails({
          IAD_Individual_Id: savedIndividualDetails._id,
          IAD_Address_Type: "02",
          IAD_Address_Line1: body.IAD_Address_Line1,
          IAD_City: body.IAD_City,
          IAD_State: body.IAD_State,
          IAD_Country: body.IAD_Country,
          IAD_Pincode: body.IAD_Pincode,
          IAD_Address_Line2: body.IAD_Address_Line2,
          IAD_Landmark: body.IAD_Landmark,
          IAD_Audit_Trail: body.IAD_Audit_Trail || [],
        }).save({ session }),

        new SocialProfile({
          SL_Id: savedIndividualDetails._id,
          SL_Individual_Role: savedIndividualDetails.ID_Individual_Role,
          SL_Product_Identifier: "000001000",
          SL_Social_Profile_Name: body.SL_Social_Profile_Name || "",
          SL_LinkedIn_Profile: body.SL_LinkedIn_Profile || "",
          SL_Website_Url: body.SL_Website_Url || "",
          SL_Instagram_Url: body.SL_Instagram_Url || "",
          SL_Facebook_Url: body.SL_Facebook_Url || "",
          SL_Twitter_Url: body.SL_Twitter_Url || "",
          SL_Pinterest_Url: body.SL_Pinterest_Url || "",
          SL_Custom_Url: body.SL_Custom_Url || "",
          SL_Portfolio_Url: body.SL_Portfolio_Url || "",
        }).save({ session }),

        new IndividualVisibility({
          IIV_Individual_Id: savedIndividualDetails._id,
          IIV_Phone_Number: true, // Default visibility ON
          IIV_Email: true, // Default visibility ON
          IIV_BirthDate: false, // Optional birthdate hide
          IIV_Address_Line1: true,
          IIV_Address_Line2: false,
          IIV_Landmark: false,
          IIV_Pincode: true,
          IIV_Website_Url_Visibility: true,
          IIV_Creation_DtTym: new Date(),
          IIV_Audit_Trail: [],
        }).save({ session }),
      ]);

      // Commit transaction quickly
      await session.commitTransaction();
      session.endSession();

      // Queue EcoLink creation (background process)
      await queueEcoLinkCreation({
        individualId: savedIndividualDetails._id,
        profileName: `${body.ID_First_Name} ${body.ID_Last_Name}`,
        profilePicture: body.ID_Profile_Picture,
        phone: body.ID_Phone,
        email: body.ID_Email,
        address: body.IAD_Address_Line1,
        city: body.IAD_City,
        state: body.IAD_State,
        website: body.SL_Website_Url,
        lang: body.lang || "en",
        route: body.route || "user-ecolink",
        designation: body.ID_Individual_Designation,
      });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set("individual_id", savedIndividualDetails._id.toString(), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      //  console.log(`Profile created in ${Date.now() - startTime}ms`);

      return new Response(
        JSON.stringify({
          success: true,
          code: "6024_18",
          title: t(`errorCode.6024_18.title`),
          message: t(`errorCode.6024_18.description`),
          individualId: savedIndividualDetails._id.toString(),
          hasProfilePicture: !!body.ID_Profile_Picture,
          first_name: body.ID_First_Name,
          last_name: body.ID_Last_Name,
          profileImage: body.ID_Profile_Picture || null,
        }),
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction Error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          code: "6024_19",
          title: t(`errorCode.6024_19.title`),
          message: t(`errorCode.6024_19.description`),
          error: error.message,
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Profile Creation Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        code: "6024_20",
        title: t(`errorCode.6024_20.title`),
        message: t(`errorCode.6024_20.description`, {
          message: error.message,
        }),
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
