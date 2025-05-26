import { getServerSession } from "next-auth";
import CompanyDetails from "@/app/models/company_details";
import CompanyAddress from "@/app/models/company_address_details";
import SocialLinks from "@/app/models/social_link";
import { dbConnect } from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * @swagger
 * /api/institution/v1/hcjArET60532FetchInstitutionDataForStaff/{company_id}:
 *   get:
 *     summary: Retrieve company data for staff and support users
 *     description: Fetches company details, address, and social links for a given company ID. Accessible only by users with roles '07' or '08'.
 *     tags:
 *       - Institution
 *     parameters:
 *       - in: path
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the company
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company data retrieved successfully
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
 *                   example: Company data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     companyDetails:
 *                       $ref: '#/components/schemas/CompanyDetails'
 *                     companyAddress:
 *                       $ref: '#/components/schemas/CompanyAddress'
 *                     socialLinks:
 *                       $ref: '#/components/schemas/SocialLinks'
 *       400:
 *         description: Missing or invalid company ID
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden: Access is denied
 *       404:
 *         description: Company details not found
 *       500:
 *         description: Internal server error
 */


export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { company_id } = await params;

    if (!company_id) {
      return NextResponse.json(
        { success: false, message: "Company ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userRole = session.user.role;

    if (!["07", "08"].includes(userRole)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Access is denied" },
        { status: 403 }
      );
    }

    const companyDetails = await CompanyDetails.findById(company_id).lean();

    if (!companyDetails) {
      return NextResponse.json(
        { success: false, message: "Company details not found" },
        { status: 404 }
      );
    }

    const [companyAddress, socialLinks] = await Promise.all([
      CompanyAddress.findOne({ CAD_Company_Id: company_id }).lean(),
      SocialLinks.findOne({ SL_Id: company_id }).lean(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Company data retrieved successfully",
        data: {
          companyDetails,
          companyAddress: companyAddress || null,
          socialLinks: socialLinks || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
