import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualAddress from "@/app/models/individual_address_detail";
import IndividualEducation from "@/app/models/individual_education";
import SocialProfile from "@/app/models/social_link";
import IndividualDocuments from "@/app/models/individual_document_details";
import HcjJobSeeker from "@/app/models/hcj_job_seeker";
import EclEcoLink from "@/app/models/ecl_ecolink";
import EclIndividualDetails from "@/app/models/ecl_individual_details";
import HcjSkills from "@/app/models/hcj_skill";
import { Experience as HcjExperience } from "@/app/models/hcj_job_seeker_experience";
import HcjLanguage from "@/app/models/hcj_job_seeker_languages";
import HcjProjects from "@/app/models/hcj_job_seeker_project";
import HcjVolunteering from "@/app/models/hcj_job_seeker_volunteer_activity";
import HcjStudent from "@/app/models/hcj_student";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61043DeleteStudentData:
 *   delete:
 *     summary: Delete all data related to a student
 *     description: Deletes the student's account and all related data from various collections (individual details, job seeker data, etc.) based on email or user ID.
 *     tags: [Super Admin Student Deletion]
 *     parameters:
 *       - name: identifier
 *         in: query
 *         description: Email or User ID to delete the student's related data.
 *         required: true
 *         schema:
 *           type: string
 *           example: "adityakas1907@gmail.com"
 *     responses:
 *       200:
 *         description: Student data deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the deletion was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Student data deleted successfully."
 *       400:
 *         description: Missing identifier (Email or User ID).
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
 *                   example: "Email or ID is required."
 *       403:
 *         description: The user is not a student account or is unauthorized to delete.
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
 *                   example: "Not a student account."
 *       404:
 *         description: Student not found with the provided identifier.
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
 *                   example: "Student not found."
 *       500:
 *         description: Internal server error during the deletion process.
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
 *                   example: "Internal server error"
 */

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("identifier");

    if (!identifier) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Email or ID is required." }),
        { status: 400 }
      );
    }

    await dbConnect();

    let user = null;
    if (identifier.includes("@")) {
      user = await User.findOne({ UT_Email: identifier });
    } else {
      user = await User.findById(identifier);
    }

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Student not found." }),
        { status: 404 }
      );
    }

    if (user.UT_User_Role !== "05") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Not a student account." }),
        { status: 403 }
      );
    }

    await deleteStudentData(user);

    return new NextResponse(
      JSON.stringify({ success: true, message: "Student data deleted successfully." }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Student delete error:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

async function deleteStudentData(user) {
  const individual = await IndividualDetails.findOneAndDelete({ ID_User_Id: user._id });

  if (individual) {
    const individualId = individual._id;

    await Promise.all([
      IndividualAddress.deleteMany({ IAD_Individual_Id: individualId }),
      IndividualEducation.deleteMany({ IE_Individual_Id: individualId }),
      SocialProfile.deleteMany({ SL_Id: individualId }),
      IndividualDocuments.deleteMany({ IDD_Individual_Id: individualId }),
      HcjJobSeeker.deleteMany({ HCJ_JS_Individual_Id: individualId }),
      EclEcoLink.deleteMany({ ECL_EL_Id: individualId }),
      EclIndividualDetails.deleteMany({ ECL_EID_Individual_Id: individualId }),
      HcjSkills.deleteMany({ HCJ_SKT_Individual_Id: individualId }),
      HcjExperience.deleteMany({ HCJ_JSX_Individual_Id: individualId }),
      HcjLanguage.deleteMany({ HCJ_JSL_Id: individualId }),
      HcjProjects.deleteMany({ HCJ_JSP_Individual_Id: individualId }),
      HcjVolunteering.deleteMany({ HCJ_JSV_Individual_Id: individualId }),
      HcjStudent.deleteMany({ HCJ_ST_Individual_Id: individualId }),
    ]);
  }

  await User.findByIdAndDelete(user._id);
}


