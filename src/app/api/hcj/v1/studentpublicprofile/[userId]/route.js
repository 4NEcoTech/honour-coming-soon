import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualAddress from "@/app/models/individual_address_detail";
import SocialLinks from "@/app/models/social_link";
import Language from "@/app/models/hcj_job_seeker_languages";
import Skills from "@/app/models/hcj_skill";
import Education from "@/app/models/individual_education";
import {Experience} from "@/app/models/hcj_job_seeker_experience";
import Project from "@/app/models/hcj_job_seeker_project";
import Volunteering from "@/app/models/hcj_job_seeker_volunteer_activity";
import HCJStudent from "@/app/models/hcj_student";
import Hcj_Job_Seeker from "@/app/models/hcj_job_seeker";
import IndividualVisibility from "@/app/models/individual_info_visibility";

/**
 * @swagger
 * /api/hcj/v1/studentPublicProfile/{userId}:
 *   get:
 *     summary: Get Student Public Profile
 *     description: |
 *       Fetches detailed student public profile including user, individual details, address, social links, language, skills, education, experience, projects, volunteering, resume, and preferred location.
 *     tags: [Student Public Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: Student public profile retrieved successfully
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
 *                   example: Student public profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     individualDetails:
 *                       type: object
 *                     address:
 *                       type: object
 *                     socialLinks:
 *                       type: object
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: object
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: object
 *                     educations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     experiences:
 *                       type: array
 *                       items:
 *                         type: object
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                     volunteeringActivities:
 *                       type: array
 *                       items:
 *                         type: object
 *                     resumeUrl:
 *                       type: string
 *                       example: https://storage.googleapis.com/...
 *                     locationPreference:
 *                       type: string
 *                       example: Bengaluru, Remote
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User or Individual details not found
 *       500:
 *         description: Internal Server Error
 */


export async function GET(req, context) {
  try {
    await dbConnect();
    const { params } = context;
    const userId = params?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // User
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Individual Details
    const individualDetails = await IndividualDetails.findOne({
      ID_User_Id: user._id,
    }).lean();

    if (!individualDetails) {
      return NextResponse.json(
        { success: false, message: "Individual details not found" },
        { status: 404 }
      );
    }

    const individualId = individualDetails._id;

    // Related Info (Parallel Fetching)
    const [
      address,
      socialLinks,
      languages,
      skills,
      educations,
      experiences,
      projects,
      volunteeringActivities,
      student,
      jobSeeker,
      visibility, 
    ] = await Promise.all([
      IndividualAddress.findOne({ IAD_Individual_Id: individualId }).lean(),
      SocialLinks.findOne({ SL_Id: individualId }).lean(),
      Language.find({
        HCJ_JSL_Ref: "IndividualDetails",
        HCJ_JSL_Id: individualId,
      }).lean(),
      Skills.find({ HCJ_SKT_Individual_Id: individualId }).lean(),
      Education.find({ IE_Individual_Id: individualId }).lean(),
      Experience.find({ HCJ_JSX_Individual_Id: individualId }).lean(),
      Project.find({ HCJ_JSP_Individual_Id: individualId }).lean(),
      Volunteering.find({ HCJ_JSV_Individual_Id: individualId }).lean(),
      HCJStudent.findOne({ HCJ_ST_Individual_Id: individualId }).lean(),
      Hcj_Job_Seeker.findOne({ HCJ_JS_Individual_Id: individualId }).lean(),
      IndividualVisibility.findOne({ IIV_Individual_Id: individualId }).lean(),

    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Student public profile fetched successfully",
        data: {
          user,
          individualDetails,
          address: address || null,
          socialLinks: socialLinks || null,
          languages: languages || [],
          skills: skills || [],
          educations: educations || [],
          experiences: experiences || [],
          projects: projects || [],
          volunteeringActivities: volunteeringActivities || [],
          resumeUrl: student?.HCJ_ST_Resume_Upload || null,
          locationPreference: jobSeeker?.HCJ_JS_Preferred_Work_Location || null,
          visibility: visibility || {},
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student public profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
