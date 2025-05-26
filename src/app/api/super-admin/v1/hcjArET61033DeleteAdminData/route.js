import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import IndividualDocuments from "@/app/models/individual_document_details";
import SocialProfile from "@/app/models/social_link";
import company_contact_person from "@/app/models/company_contact_person";
import EclIndividualDetails from "@/app/models/ecl_individual_details";
import EclCompanyProfile from "@/app/models/ecl_company_profile";
import IndividualAddress from "@/app/models/individual_address_detail";
import CompanyDetails from "@/app/models/company_details";
import CompanyAddress from "@/app/models/company_address_details";
import CompanyKYC from "@/app/models/company_kyc_details";
import EclEcoLink from "@/app/models/ecl_ecolink";
import hcj_student from "@/app/models/hcj_student";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/super-admin/v1/hcjArET61033DeleteAdminData:
 *   delete:
 *     summary: Delete all data related to an admin or staff account
 *     description: Deletes the administrator or staff user's account and all associated data from various collections (individual details, company, contact persons, etc.) based on email or user ID.
 *     tags: [Super Admin Administrator Deletion]
 *     parameters:
 *       - name: identifier
 *         in: query
 *         description: Email or User ID to delete the admin's related data.
 *         required: true
 *         schema:
 *           type: string
 *           example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Admin and associated data deleted successfully.
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
 *                   example: "Admin data deleted successfully."
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
 *         description: The user is not an admin or staff account.
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
 *                   example: "Not an administrator account."
 *       404:
 *         description: Admin user not found with the provided identifier.
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
 *                   example: "User not found."
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
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    // admin/staff/support roles
    const allowedRoles = ["06", "07", "08", "09", "10", "11"];
    if (!allowedRoles.includes(user.UT_User_Role)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Not an administrator account.",
        }),
        { status: 403 }
      );
    }

    await deleteAdminUserData(user);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Administrator and associated data deleted.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin delete error:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

// Deletes an Institution Administrator and all linked collections
async function deleteAdminUserData(user) {
  const individual = await IndividualDetails.findOneAndDelete({
    ID_User_Id: user._id,
  });

  if (individual) {
    const individualId = individual._id;

    await Promise.all([
      IndividualAddress.deleteMany({ IAD_Individual_Id: individualId }),
      SocialProfile.deleteMany({ SL_Id: individualId }),
      IndividualDocuments.deleteMany({ IDD_Individual_Id: individualId }),
      EclIndividualDetails.deleteMany({ ECL_EID_Individual_Id: individualId }),
      EclEcoLink.deleteMany({ ECL_EL_Id: individualId }),
    ]);

    const company = await CompanyDetails.findOneAndDelete({
      CD_Individual_Id: individualId,
    });

    if (company) {
      const companyId = company._id;
      const companyNum = company.CD_Company_Num;

      await Promise.all([
        CompanyAddress.deleteMany({ CAD_Company_Id: companyId }),
        CompanyKYC.deleteMany({ CKD_Company_Id: companyId }),
        SocialProfile.deleteMany({ SL_Id: companyId }),
        EclEcoLink.deleteMany({ ECL_EL_Id: companyId }),
        EclCompanyProfile.deleteMany({ ECL_ECP_Company_Id: companyId }),
        company_contact_person.deleteMany({ CCP_Company_Id: companyId }),
        hcj_student.deleteMany({ HCJ_ST_InstituteNum: companyNum }),
      ]);
    }
  }

  await User.findByIdAndDelete(user._id);
}
