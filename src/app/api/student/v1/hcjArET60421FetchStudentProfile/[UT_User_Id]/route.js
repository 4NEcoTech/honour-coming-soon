import { dbConnect } from "@/app/utils/dbConnect";
import User from "@/app/models/user_table";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/student/v1/hcjBrET60421StudentProfileCreate/[UT_User_Id]:
 *   get:
 *     summary: Fetch a student profile
 *     description: Retrieves the student profile, address details, social profiles, and education records using their `UT_User_Id` (email or ObjectId).
 *     tags: [Student Profile]
 *     parameters:
 *       - in: path
 *         name: UT_User_Id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique user ID (MongoDB ObjectId or email) of the student.
 *         example: "67bec1b87d16a63ff0b4ab5b" (ObjectId) or "adityakas1907@gmail.com" (Email)
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully.
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
 *                   properties:
 *                     UT_User_Id:
 *                       type: string
 *                       example: "adityakas1907@gmail.com"
 *                     profile:
 *                       type: object
 *                       properties:
 *                         ID_First_Name:
 *                           type: string
 *                           example: "John"
 *                         ID_Last_Name:
 *                           type: string
 *                           example: "Doe"
 *                         ID_Email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                         ID_Phone:
 *                           type: string
 *                           example: "+919876543210"
 *                         ID_Gender:
 *                           type: string
 *                           example: "01"
 *                     address:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           IAD_City:
 *                             type: string
 *                             example: "Ayodhya"
 *                           IAD_State:
 *                             type: string
 *                             example: "Uttar Pradesh"
 *                           IAD_Country:
 *                             type: string
 *                             example: "India"
 *                     socialProfiles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           SL_Social_Profile_Name:
 *                             type: string
 *                             example: "LinkedIn"
 *                           SL_LinkedIn_Profile:
 *                             type: string
 *                             example: "https://linkedin.com/in/johndoe"
 *                     education:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           IE_Institute_Name:
 *                             type: string
 *                             example: "CCS University"
 *                           IE_Program_Name:
 *                             type: string
 *                             example: "Computer Science"
 *                           IE_Year:
 *                             type: string
 *                             example: "2025"
 *       400:
 *         description: Invalid or missing user ID.
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
 *                   example: "Invalid user ID format"
 *       404:
 *         description: User not found.
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
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
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
 *                   example: "Internal Server Error"
 */

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Extract user ID from route parameters correctly
    const UT_User_Id = await params?.UT_User_Id; // Ensure it's extracted properly

    // Validate if UT_User_Id is provided
    if (!UT_User_Id) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required" }),
        { status: 400 }
      );
    }

    // If `UT_User_Id` is an email, use it directly, otherwise check for ObjectId format
    let queryCondition = {};
    if (UT_User_Id.includes("@")) {
      queryCondition = { UT_User_Id }; // Search by email
    } else if (mongoose.Types.ObjectId.isValid(UT_User_Id)) {
      queryCondition = { _id: new mongoose.Types.ObjectId(UT_User_Id) }; // Search by ObjectId
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid user ID format" }),
        { status: 400 }
      );
    }

    // Step 1: Find User in `user_table`
    const userProfile = await User.aggregate([
      { $match: queryCondition },
      {
        $lookup: {
          from: "individual_details",
          localField: "_id",
          foreignField: "ID_User_Id",
          as: "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
    ]);

    if (!userProfile || userProfile.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const profile = userProfile[0].profile; // Get `individual_details`
    if (!profile) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "User has no profile details yet",
          data: userProfile[0],
        }),
        { status: 200 }
      );
    }

    const individualId = profile._id; // Use `individual_details._id` for foreign key

    // Step 2: Fetch Address and Social Profiles (Removed Education)
    const [address, socialProfiles] = await Promise.all([
      mongoose.connection
        .collection("individual_address_details")
        .find({ IAD_Individual_Id: new mongoose.Types.ObjectId(individualId) })
        .toArray(),
      mongoose.connection
        .collection("social_links")
        .find({ SL_Id: new mongoose.Types.ObjectId(individualId) })
        .toArray(),
    ]);

    // Merge data and return response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...userProfile[0], // User data from `user_table`
          profile, // Profile data from `individual_details`
          address, // Address details from `individual_address_detail`
          socialProfiles, // Social profiles from `social_link`
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}


