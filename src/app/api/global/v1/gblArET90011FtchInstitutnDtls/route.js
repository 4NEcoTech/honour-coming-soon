import Institution from "@/app/models/institution";
import { dbConnect } from "@/app/utils/dbConnect";
import { getTranslator } from "@/i18n/server";
import { NextResponse } from "next/server";

/**
 * @swagger
 *  /api/global/v1/gblArET90011FtchInstitutnDtls
 *   get:
 *     summary: Fetch institutions based on various filters
 *     description: Retrieve institutions based on AISHE code, name, state, district, or status. Supports search, dropdown, and optimized queries.
 *     parameters:
 *       - name: AISHE_Code
 *         in: query
 *         description: Fetch an institution by its AISHE Code (unique identifier)
 *         schema:
 *           type: string
 *       - name: institutionName
 *         in: query
 *         description: Search institutions by name (Minimum 4 characters required)
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         description: Filter institutions by state
 *         schema:
 *           type: string
 *       - name: district
 *         in: query
 *         description: Filter institutions by district
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter institutions by status (e.g., Active, Inactive)
 *         schema:
 *           type: string
 *       - name: dropdown
 *         in: query
 *         description: If true, returns only institution names and AISHE codes for dropdown selection
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: limit
 *         in: query
 *         description: Number of records to fetch (default = 50)
 *         schema:
 *           type: integer
 *           example: 50
 *     responses:
 *       200:
 *         description: Successfully retrieved institutions
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
 *                       AISHE_Code:
 *                         type: string
 *                         example: "123456"
 *                       Institute_Name:
 *                         type: string
 *                         example: "Indian Institute of Technology Delhi"
 *                       Category:
 *                         type: string
 *                         example: "University"
 *                       Name_of_Affiliated_University:
 *                         type: string
 *                         example: "N/A"
 *                       Type_of_Institute:
 *                         type: string
 *                         example: "Public"
 *                       State:
 *                         type: string
 *                         example: "Delhi"
 *                       District:
 *                         type: string
 *                         example: "New Delhi"
 *                       Status:
 *                         type: string
 *                         example: "Active"
 *       400:
 *         description: Bad request - Invalid query parameters
 *       500:
 *         description: Internal Server Error
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

export async function GET(req) {
  const locale = req.headers.get("accept-language") || "en";
  const t = await getTranslator(locale);
  await dbConnect(); // Ensure DB is connected

  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const status = searchParams.get("status");
    const aisheCode = searchParams.get("AISHE_Code");
    const institutionName = searchParams.get("institutionName"); // Search by name
    const dropdown = searchParams.get("dropdown"); // Fetch only institution names if true
    const limit = parseInt(searchParams.get("limit")) || 50; // Limit results

    let query = {};

    if (aisheCode) {
      query.AISHE_Code = aisheCode; // Fetch by AISHE Code
    } else if (institutionName && institutionName.length >= 4) {
      // Search by name only if at least 4 characters are entered
      query.Institute_Name = { $regex: institutionName, $options: "i" };
    } else {
      if (state) query.State = state;
      if (district) query.District = district;
      if (status) query.Status = status;
    }

    // If dropdown=true, return only institution names
    const selectFields = dropdown
      ? "Institute_Name AISHE_Code" // Fetch only required fields
      : "Category AISHE_Code Institute_Name Name_of_Affiliated_University Type_of_Institute State District Status";

    const institutions = await Institution.find(query)
      .select(selectFields)
      .limit(limit) // Limit results for better performance
      .lean(); // Convert Mongoose documents to plain objects

    return NextResponse.json(
      {
        success: true,
        code: "9001_1",
        title: t(`errorCode.9001_1.title`),
        message: t(`errorCode.9001_1.description`),
        data: institutions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json(
      {
        success: false,
        code: "9001_2",
        title: t(`errorCode.9001_2.title`),
        message: t(`errorCode.9001_2.description`),
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
