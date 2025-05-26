import { NextResponse } from "next/server";
import User from "@/app/models/user_table";
import IndividualDetails from "@/app/models/individual_details";
import CompanyDetails from "@/app/models/company_details";
import { dbConnect } from "@/app/utils/dbConnect";

/**
 * @swagger
 * /api/super-admin/v1/institutionDetailsGet:
 *   get:
 *     summary: Fetch verified companies linked to verified admin/staff users
 *     description: Retrieves a list of companies with verification status '01' that are linked to verified admin or staff accounts across multiple collections.
 *     tags: [Super Admin Get Institution Data For Bulk Import]
 *     responses:
 *       200:
 *         description: Successfully retrieved verified companies and their associated user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       individual_id:
 *                         type: string
 *                         example: "661ba8b2472f11aadb49abf6"
 *                       company_id:
 *                         type: string
 *                         example: "6620a0e3126c8b2e49f4ff15"
 *                       company_num:
 *                         type: string
 *                         example: "HCJCMPT2201"
 *                       company_name:
 *                         type: string
 *                         example: "Atria Institute of Technology"
 *       500:
 *         description: Internal server error while fetching data.
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


export async function GET() {
  try {
    await dbConnect();

    // Step 1: Get verified users with admin roles
    const verifiedUsers = await User.find({
      UT_User_Verification_Status: "01",
      UT_User_Role: { $in: ["06", "07", "08", "09", "10", "11"] },
    });

    const userIds = verifiedUsers.map((user) => user._id);

    // Step 2: Find IndividualDetails for these users
    const individuals = await IndividualDetails.find({
      ID_User_Id: { $in: userIds },
    });

    const individualIds = individuals.map((ind) => ind._id);

    // Step 3: Get verified CompanyDetails for these individuals
    const companies = await CompanyDetails.find({
      CD_Company_Status: "01",
      CD_Individual_Id: { $in: individualIds },
    });

    // Step 4: Build response
    const response = companies.map((company) => {
      const individual = individuals.find(
        (ind) => ind._id.toString() === company.CD_Individual_Id.toString()
      );
      return {
        individual_id: company.CD_Individual_Id,
        company_id: company._id,
        company_num: company.CD_Company_Num,
        company_name: company.CD_Company_Name,
      };
    });

    return NextResponse.json({ success: true, data: response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching verified companies:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
