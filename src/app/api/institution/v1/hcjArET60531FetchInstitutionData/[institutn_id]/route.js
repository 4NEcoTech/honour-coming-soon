import { getServerSession } from "next-auth";
import IndividualDetails from "@/app/models/individual_details";
import CompanyDetails from "@/app/models/company_details";
import CompanyAddress from "@/app/models/company_address_details";
import SocialLinks from "@/app/models/social_link";
import CompanyDocuments from "@/app/models/company_kyc_details";
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/institution/v1/hcjArET60531FetchInstitutionData/{institution_id}:
 *   get:
 *     summary: Get Institution Details
 *     description: Fetches institution details along with individual details, company details, address, social links, and documents.
 *     tags: [Institution]
 *     parameters:
 *       - in: path
 *         name: institution_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the institution
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Institution details retrieved successfully
 *       400:
 *         description: Missing institution ID
 *       401:
 *         description: Unauthorized - User session invalid
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Institution or details not found
 *       500:
 *         description: Internal Server Error
 */

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Extract institution ID from request parameters
    const { institutn_id } = await params;
    if (!institutn_id) {
      return NextResponse.json(
        { success: false, message: "Institution ID is required" },
        { status: 400 }
      );
    }

    // Validate session
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    console.log("Fetching details for institution ID:", institutn_id);

    // Fetch Individual Details
    const individualDetails = await IndividualDetails.findById(institutn_id).lean();
    if (!individualDetails) {
      return NextResponse.json(
        { success: false, message: "Individual details not found" },
        { status: 404 }
      );
    }

    // Fetch Company Details using Individual ID
    const companyDetails = await CompanyDetails.findOne({
      CD_Individual_Id: individualDetails._id,
    }).lean();

    if (!companyDetails) {
      return NextResponse.json(
        { success: false, message: "Institution details not found" },
        { status: 404 }
      );
    }

    // Fetch related data concurrently using company ID
    const [companyAddress, socialLinks, companyDocuments] = await Promise.all([
      CompanyAddress.findOne({ CAD_Company_Id: companyDetails._id }).lean(),
      SocialLinks.findOne({ SL_Id: companyDetails._id }).lean(),
      CompanyDocuments.findOne({ CKD_Company_Id: companyDetails._id }).lean(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Institution details retrieved successfully",
        data: {
          individualDetails,
          companyDetails,
          companyAddress: companyAddress || null,
          socialLinks: socialLinks || null,
          companyDocuments: companyDocuments || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching institution details:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

