import { dbConnect } from "@/app/utils/dbConnect";
import CompanyDetail from "@/app/models/company_details";
import HCJStudent from "@/app/models/hcj_student";
import { getPaginatedResults } from "@/app/utils/paginationUtils";

/**
 * @swagger
 * /api/hcj/v1/hcjArET60021fetchVerifyInstitution:
 *   get:
 *     summary: Get list of verified institutions with student count
 *     description: >
 *       Retrieves a paginated list of institutions that are verified (`CD_Company_Status = "01"`),  
 *       along with their associated verified student count.  
 *       Includes search and pagination capabilities.
 *     tags:
 *       - Fetch Verified Institution on Educational Institution Page
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of institutions per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword to match company name, email, about, or website
 *     responses:
 *       200:
 *         description: Successfully retrieved verified institutions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       CD_Individual_Id:
 *                         type: string
 *                       CD_Company_Name:
 *                         type: string
 *                       CD_Company_Logo:
 *                         type: string
 *                       CD_Company_Email:
 *                         type: string
 *                       CD_Company_Website:
 *                         type: string
 *                       CD_Company_Num:
 *                         type: string
 *                       CD_Company_About:
 *                         type: string
 *                       CD_Company_Status:
 *                         type: string
 *                         enum: ["01"]
 *                         description: "01 = Verified"
 *                       verifiedStudentCount:
 *                         type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 batchNumber:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */

export async function GET(request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Force only verified institutions
    const cleanedSearchParams = new URLSearchParams(searchParams);
    cleanedSearchParams.set("CD_Company_Status", "01");
    cleanedSearchParams.set("CD_Company_Logo__$exists", "true");
    cleanedSearchParams.set("CD_Company_Logo__$ne", '""'); 

    const searchFields = [
      "CD_Company_Name",
      "CD_Company_Email",
      "CD_Company_About",
      "CD_Company_Website",
    ];

    const projection = {
      _id: 1,
      CD_Individual_Id: 1,
      CD_Company_Name: 1,
      CD_Company_Logo: 1,
      CD_Company_Email: 1,
      CD_Company_Website: 1,
      CD_Company_Num: 1,
      CD_Company_About: 1,
      CD_Company_Status: 1,
    };

    // Fetch paginated results
    const paginatedResponse = await getPaginatedResults(
      CompanyDetail,
      cleanedSearchParams,
      searchFields,
      projection
    );

    // Parse full response and extract all metadata
    const parsedResult = await paginatedResponse.json();

    const institutions = parsedResult?.data || [];

    const {
      total = 0,
      totalPages = 1,
      currentPage = 1,
      batchNumber = 1,
    } = parsedResult;

    // Enrich each institution with verified student count
    const enrichedData = await Promise.all(
      institutions.map(async (institution) => {
        const verifiedStudentCount = await HCJStudent.countDocuments({
          HCJ_ST_InstituteNum: institution.CD_Company_Num,
          HCJ_ST_Individual_Id: { $ne: null },
        });

        return {
          _id: institution._id,
          CD_Individual_Id: institution.CD_Individual_Id,
          CD_Company_Name: institution.CD_Company_Name,
          CD_Company_Logo: institution.CD_Company_Logo,
          CD_Company_Email: institution.CD_Company_Email,
          CD_Company_Website: institution.CD_Company_Website,
          CD_Company_Num: institution.CD_Company_Num,
          CD_Company_About: institution.CD_Company_About,
          CD_Company_Status: institution.CD_Company_Status,
          verifiedStudentCount,
        };
      })
    );

    // Return full data with pagination meta
    return new Response(
      JSON.stringify({
        data: enrichedData,
        total,
        totalPages,
        currentPage,
        batchNumber,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetchVerifyInstitution:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500 }
    );
  }
}
