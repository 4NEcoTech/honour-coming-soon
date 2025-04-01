import HcjAchieversCentral from "@/app/models/hcj_achievers_central";
import { dbConnect } from "@/app/utils/dbConnect";
import { getPaginatedResults } from "@/app/utils/paginationUtils";

/**
 * @swagger
 * /api/hcj/v1/hcjArET61081AchieverCentral:
 *   get:
 *     summary: Fetch achievers (with search, pagination, and optional month filter)
 *     description: Retrieves paginated achievers. Optionally filters by verified month.
 *     tags: [Super Admin Achiever Central]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page (default is 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text to search in achiever fields
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Filter by month (format: YYYY-MM)
 *     responses:
 *       200:
 *         description: Successfully fetched achievers
 *       500:
 *         description: Error fetching achievers
 */

// http://localhost:3000/api/hcj/v1/hcjArET61081AchieverCentral?page=1&limit=10
// http://localhost:3000/api/super-admin/v1/hcjArET61081AchieverCentral?status=01
// http://localhost:3000/api/hcj/v1/hcjArET61081AchieverCentral?search=aditya&page=1&limit=5
// http://localhost:3000/api/hcj/v1/hcjArET61081AchieverCentral?month=2025-03&page=1&limit=10
// http://localhost:3000/api/hcj/v1/hcjArET61081AchieverCentral?search=tech&month=2025-02&page=1&limit=10



export async function GET(request) {
  try {
    await dbConnect();
    const searchParams = new URL(request.url).searchParams;

    const month = searchParams.get("month");
    const searchFields = [
      "HCJ_AC_Achievers_Name",
      "HCJ_AC_Achievers_Event_Name",
      "HCJ_AC_College_Name",
      "HCJ_AC_Achievers_Event_Description",
    ];

    // Optional filter: by month & status '01'
    let baseFilter = {};
    if (month) {
      const start = new Date(`${month}-01T00:00:00Z`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      baseFilter = {
        HCJ_AC_Status: "01",
        HCJ_AC_Publish_Dt: { $gte: start, $lt: end },
      };
    }

    return await getPaginatedResults(
      HcjAchieversCentral,
      searchParams,
      searchFields,
      baseFilter,
      async (achiever) => {
        return {
          _id: achiever._id,
          HCJ_AC_Achievers_Name: achiever.HCJ_AC_Achievers_Name,
          HCJ_AC_Status: achiever.HCJ_AC_Status,
          HCJ_AC_Publish_Dt: achiever.HCJ_AC_Publish_Dt,
          HCJ_AC_Achievers_Event_Dt: achiever.HCJ_AC_Achievers_Event_Dt,
          HCJ_AC_Achievers_Event_Name: achiever.HCJ_AC_Achievers_Event_Name,
          HCJ_AC_Achievers_Event_Description: achiever.HCJ_AC_Achievers_Event_Description,
          HCJ_AC_Achievers_Award_Description: achiever.HCJ_AC_Achievers_Award_Description,
          HCJ_AC_College_Name: achiever.HCJ_AC_College_Name,
          HCJ_AC_Achievers_Photo:achiever.HCJ_AC_Achievers_Photo,
          HCJ_AC_Achievers_Award_Img: achiever.HCJ_AC_Achievers_Award_Img,
          HCJ_AC_Achievers_Award_Detail_Description: achiever.HCJ_AC_Achievers_Award_Detail_Description,
          HCJ_AC_Creation_DtTym: achiever.HCJ_AC_Creation_DtTym,
        };
      }
    );
  } catch (error) {
    console.error("Error fetching achievers:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching achievers" }),
      { status: 500 }
    );
  }
}
